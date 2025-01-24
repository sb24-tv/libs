import express, {
	NextFunction,
	Request,
	Response,
	Router
} from 'express';
import bodyParser, {
	Options,
	OptionsJson,
	OptionsUrlencoded ,
	OptionsText
} from 'body-parser';
import {
	CoreMiddleware,
	DECORATOR_KEY,
	ErrorInterceptor,
	Interceptor,
	isInterceptor,
	isInterceptorError,
	isMiddleware,
	prepareController
} from "../../controller";

import AppContext from "./AppContext";
import { serverOptions } from "./index";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { HttpError } from "../../http-error-exception";

export class CoreApplication {
	public server = express();
	private controllerClasses: Function[] = prepareController(this.options.controllers);
	private interceptorsBefore: Interceptor[] = [];
	private interceptorsAfter: Interceptor[] = [];
	private interceptorError: ErrorInterceptor[] = [];
	private middlewares: CoreMiddleware[] = [];
	private providers: Function[] | undefined = this.options.providers;
	private appContext: AppContext = new AppContext();
	
	constructor(private options: serverOptions) {}
	
	public useGlobalMiddleware(...middlewares: any[]) {
		middlewares.forEach((instance) => {
			const middleware = new instance();
			if (isMiddleware(middleware)) {
				this.middlewares.push(middleware);
			}
		});
	}
	
	public useGlobalInterceptors(...interceptors: any[]) {
		interceptors.forEach((instance) => {
			const after = Reflect.getMetadata(DECORATOR_KEY.AFTER_INTERCEPTOR, instance);
			const before = Reflect.getMetadata(DECORATOR_KEY.BEFORE_INTERCEPTOR, instance);
			
			const interceptClass = new instance();
			
			if (isInterceptor(interceptClass)) {
				if (after) this.interceptorsAfter.push(interceptClass);
				if (before) this.interceptorsBefore.push(interceptClass);
			}
			
			if (isInterceptorError(interceptClass)) {
				this.interceptorError.push(interceptClass);
			}
		});
	}
	
	private registerController(controllers: any[], providers: Function[] | undefined) {
		// Create a simple map to store provider instances for injection
		const providerInstances = new Map();
		
		if (providers) {
			for (const ProviderClass of providers) {
				// @ts-ignore
				providerInstances.set(ProviderClass, new ProviderClass());
			}
		}
		
		for (const ControllerClass of controllers) {
			const router = Router();
			
			// Inject providers into the controller constructor
			const controllerInstance = this.instantiateController(ControllerClass, providerInstances);
			const prototype = Object.getPrototypeOf(controllerInstance);
			const methods = Object.getOwnPropertyNames(prototype);
			const basePath = Reflect.getMetadata(DECORATOR_KEY.CONTROLLER_PATH, ControllerClass);
			const isController = Reflect.getMetadata(DECORATOR_KEY.CONTROLLER, ControllerClass);
			
			if (isController !== DECORATOR_KEY.CONTROLLER) continue;
			
			if (!basePath) {
				console.warn(
					`\x1b[43m [Warning] Controller ${ControllerClass.name} is missing a base path. \x1b[0m`
				);
				continue;
			}
			
			for (const methodName of methods) {
				if (methodName === "constructor") continue;
				
				const route = Reflect.getMetadata(DECORATOR_KEY.ROUTE_PATH, prototype, methodName) || "";
				const method = Reflect.getMetadata(DECORATOR_KEY.METHOD, prototype, methodName);
				
				if (typeof controllerInstance[methodName] === "function" && method) {
					// @ts-ignore
					router[method](
						route,
						async (request: Request, response: Response, next: NextFunction) => {
							try {
								const method = controllerInstance[methodName];
								const paramsMeta = Reflect.getMetadata(DECORATOR_KEY.PARAM, controllerInstance, methodName) || [];
								const queryMeta = Reflect.getMetadata(DECORATOR_KEY.QUERY, controllerInstance, methodName) || [];
								const resIndex = Reflect.getMetadata(DECORATOR_KEY.RESPONSE, controllerInstance, methodName);
								const reqIndex = Reflect.getMetadata(DECORATOR_KEY.REQUEST, controllerInstance, methodName);
								const reqBodyIndex = Reflect.getMetadata(DECORATOR_KEY.REQUEST_BODY, controllerInstance, methodName);
								
								const args: any[] = [];
								
								// Handle @Param
								paramsMeta.forEach(({param, parameterIndex}: { param: string, parameterIndex: number }) => {
									args[parameterIndex] = param ? request.params[param] : request.params;
								});
								
								// Handle @Query
								queryMeta.forEach(({queryKey, queryIndex}: { queryKey: string, queryIndex: number }) => {
									args[queryIndex] = queryKey ? request.query[queryKey] : request.query;
								});
								
								// Handle @Res
								if (resIndex !== undefined) {
									args[resIndex] = response;
								}
								// Handle @Request
								if (reqIndex !== undefined) {
									args[reqIndex] = request;
								}
								
								// Handle @Body
								if (reqBodyIndex !== undefined) {
									const ResBodyType = Reflect.getMetadata(DECORATOR_KEY.REQUEST_BODY_TYPE, controllerInstance, methodName);
									
									if (ResBodyType) {
										const instance = plainToInstance(ResBodyType, request.body);
										const errors = await validate(instance);
										if (errors.length > 0) {
											const error = new HttpError('Validation Error',403,errors[0]);
											error.stack = errors[0].toString();
											return next(error);
										}
									}
									
									args[reqBodyIndex] = request.body;
								}
								
								const result = controllerInstance[methodName](...args);
								
								// check method is promise
								if (result instanceof Promise) {
									result.then(this.appContext.sendJsonResponse).catch(next);
								} else if (result !== undefined) {
									this.appContext.sendJsonResponse(result)
								} else {
									// apply default response
									method.apply(controllerInstance, args);
								}
								
							} catch (err) {
								next(err);
							}
						}
					);
					
					console.log(
						`\x1b[32m[Route] ${basePath + route} [Method] ${method.toUpperCase()} [Controller] ${ControllerClass.name}.${methodName}\x1b[0m`
					);
					
				}
			}
			
			// Attach the router to the server
			this.server.use(basePath, router);
		}
	}

    // Helper method to instantiate controllers with injected providers
	private instantiateController(ControllerClass: any, providerInstances: Map<any, any>) {
		const paramTypes: any[] = Reflect.getMetadata("design:paramtypes", ControllerClass) || [];
		const dependencies = paramTypes.map(type => providerInstances.get(type) || null);
		return new ControllerClass(...dependencies);
	}
	
	public setBodyParserOptions(options: {
		urlencoded?: OptionsUrlencoded,
		json?: OptionsJson,
		raw?: Options,
		text?: OptionsText
	}) {
		this.server.use(express.json());
		for (let key in options) {
			// @ts-ignore
			this.server.use(bodyParser[key](options[key]));
		}
	}
	
	private executeInterceptorBefore() {
		if(this.interceptorsBefore.length > 0) {
			this.interceptorsBefore.forEach((interceptor)=> {
				this.server.use((request, response,next) => {
					this.appContext.interceptor = interceptor;
					this.appContext.request = request;
					this.appContext.response = response;
					next();
				});
			});
		
		} else {
			this.server.use((request, response,next) => {
				this.appContext.request = request;
				this.appContext.response = response;
				next();
			});
		}
	}
	
	private executeMiddleware(){
		this.middlewares.forEach(middleware => {
            this.server.use(middleware.use);
        });
	}
	
	private catch(){
		this.interceptorError.forEach((instance) => {
			this.server.use((error: any, request: Request, response: Response, next: NextFunction) => {
				const data = instance.catch({
					error,
					request,
					response,
					next
				});
				
				if(data !== undefined) {
					response.status(200).json(data);
				}
			});
		})
	}
	
	private executeInterceptorAfter() {
		this.interceptorsAfter.forEach(interceptor => {
			this.server.use((request, response) => {
				const data = interceptor.intercept({ response, request });
				if(data !== undefined) {
					response.status(200).json(data);
				}
			});
		});
	}
	
	listen(port: number | string, callback: () => void){
		this.executeMiddleware();
		this.executeInterceptorBefore();
		this.registerController(this.controllerClasses,this.providers)
		this.executeInterceptorAfter();
		this.catch();
		this.server.listen(port, callback);
	}
	
	
}