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
	executeRoute,
	FileUpload,
	Interceptor,
	isInterceptor,
	isInterceptorError,
	isMiddleware,
	prepareController
} from "../../controller";
import {
	CorsOptions,
	CorsOptionsDelegate
} from "cors";
import AppContext from "./AppContext";
import { serverOptions } from "./index";

export class CoreApplication {

	public server = express();

	private corsOptions: CorsOptions | CorsOptionsDelegate = {}
	private controllerClasses: Function[] = prepareController(this.options.controllers);
	private interceptorsBefore: Interceptor[] = [];
	private interceptorsAfter: Interceptor[] = [];
	private interceptorError: ErrorInterceptor[] = [];
	private middlewares: CoreMiddleware[] = [];
	private providers: Function[] | undefined = this.options.providers;
	private prefix: string;
	private excludePrefix: string[] | undefined = [];
	
	constructor(private options: serverOptions) {}
	
	/**
     * Registers global middleware functions to be used by the application.
     * Each middleware is instantiated and added to the middleware stack if it meets the criteria.
     *
     * @param middlewares - A list of middleware classes to be instantiated and used globally.
     * Each middleware should be a class that can be instantiated.
     */
    public useGlobalMiddleware(...middlewares: any[]) {
        middlewares.forEach((instance) => {
            const middleware = new instance();
            if (isMiddleware(middleware)) {
                this.middlewares.push(middleware);
            }
        });
    }
	
	public enableCors(options: CorsOptions | CorsOptionsDelegate) {
		this.corsOptions = options;
	}
	
	/**
     * Sets a global prefix for all routes in the application.
     * This prefix will be prepended to all controller paths unless specified in the exclude list.
     *
     * @param prefix - The global prefix to be applied to all routes.
     * @param excludePrefix - An optional array of route paths that should not have the global prefix applied.
     */
    public setGlobalPrefix(prefix: string, excludePrefix?: string[]) {
        this.prefix = prefix;
        this.excludePrefix = excludePrefix;
    }
	
	/**
	 * Registers global interceptors for the application.
	 * This method allows adding interceptors that will be applied globally to all routes.
	 * It supports both regular interceptors (before and after) and error interceptors.
	 *
	 * @param interceptors - An array of interceptor classes to be instantiated and used globally.
	 *                       Each interceptor should be a class that can be instantiated.
	 *
	 * @remarks
	 * The method uses reflection to determine if an interceptor should be executed before or after
	 * the main request handling, or if it's an error interceptor. It then adds the interceptor
	 * to the appropriate internal array (interceptorsBefore, interceptorsAfter, or interceptorError).
	 *
	 * @example
	 * ```
	 * app.useGlobalInterceptors(LoggingInterceptor, ErrorHandlingInterceptor);
	 * ```
	 */
	public useGlobalInterceptors(...interceptors: any[]) {
	    interceptors.forEach((instance) => {
	        const after = Reflect.getMetadata(DECORATOR_KEY.AFTER_INTERCEPTOR, instance);
	        const before = Reflect.getMetadata(DECORATOR_KEY.BEFORE_INTERCEPTOR, instance);
	        const interceptClass = new instance();
	        if (isInterceptor(interceptClass)) {
	            if (after) this.interceptorsAfter.push(interceptClass);
	            if (before) this.interceptorsBefore.push(interceptClass);
	        }
	        if (isInterceptorError(interceptClass)) this.interceptorError.push(interceptClass);
	    });
	}
	
	private registerController(controllers: any[], providers: Function[] | undefined) {
		// 	try {
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
				console.warn(`\x1b[43m [Warning] Controller ${ControllerClass.name} is missing a base path. \x1b[0m`);
				continue;
			}
			
			const routePath = this.excludePrefix?.includes(basePath) ? basePath : this.prefix ? this.prefix + basePath : basePath;
			
			for (const methodName of methods) {
				if (methodName === "constructor") continue;
				
				const route_path = Reflect.getMetadata(DECORATOR_KEY.ROUTE_PATH,prototype,methodName) || "";
				const classMethod = Reflect.getMetadata(DECORATOR_KEY.METHOD,prototype,methodName);
				
				if (typeof controllerInstance[methodName] === "function" && classMethod) {
					const fileUpload = Reflect.getMetadata(DECORATOR_KEY.FILE_UPLOAD,controllerInstance, methodName);
					const args = [route_path];
					const appContext: AppContext = new AppContext();
					if (fileUpload) {
						const multer = require("multer");
						if(!multer) throw new Error("Invalid multer install");
						
						const {
							keyField,
							storage,
							type,
							limits,
							dest,
							preservePath,
							fileFilter,
							maxCount
						} = fileUpload.options as FileUpload;
						
						const upload = multer({
							dest,
							storage,
							limits,
							preservePath,
							fileFilter
						});
						
						switch (type) {
							case "single":
								if (typeof keyField === "string") {
									args.push(upload.single(keyField))
								}
                                break;
                            case "array":
	                            if (typeof keyField === "string") {
		                            args.push(upload.array(keyField, maxCount))
	                            }
                                break;
                            case "fields":
								if (Array.isArray(keyField)) {
									args.push(upload.fields(keyField));
								}
                                break;
							case "any" :
								args.push(upload.any());
								break;
							case "none" :
								args.push(upload.none());
								break;
						}
					}
					
					args.push(executeRoute.bind({
						controllerInstance,
						methodName,
						appContext
					}));
					
					// @ts-ignore
					router[classMethod](...args);
					if(this.options.enableLogging) {
						console.log(
							`\x1b[32m[Route] ${routePath}${route_path} [Method] ${classMethod.toUpperCase()} [Controller] ${ControllerClass.name}.${methodName}\x1b[0m`
						);
					}
				}
			}
			
			this.server.use(routePath, router);
		}
	}

    // Helper method to instantiate controllers with injected providers
	private instantiateController(ControllerClass: any, providerInstances: Map<any, any>) {
		const paramTypes: any[] = Reflect.getMetadata("design:paramtypes", ControllerClass) || [];
		const dependencies = paramTypes.map(type => providerInstances.get(type) || null);
		return new ControllerClass(...dependencies);
	}
	
	/**
	 * Configures body parsing options for the Express server.
	 * This method sets up middleware to parse incoming request bodies based on the provided options.
	 *
	 * @param options - An object containing configuration options for different body parser types.
	 * @param options.urlencoded - Options for parsing URL-encoded bodies. See OptionsUrlencoded for details.
	 * @param options.json - Options for parsing JSON bodies. See OptionsJson for details.
	 * @param options.raw - Options for parsing raw bodies. See Options for details.
	 * @param options.text - Options for parsing plain text bodies. See OptionsText for details.
	 *
	 * @returns void
	 *
	 * @remarks
	 * This method first applies the express.json() middleware, then iterates through the provided options
	 * to apply additional body-parser middleware as specified.
	 */
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
		const appContext: AppContext = new AppContext();
		if(this.interceptorsBefore.length > 0) {
			this.interceptorsBefore.forEach((interceptor)=> {
				this.server.use((request,response,next) => {
					appContext.interceptor = interceptor;
					appContext.request = request;
					appContext.response = response;
					next();
				});
			});
		} else {
			this.server.use((request,response,next) => {
				appContext.request = request;
				appContext.response = response;
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
			this.server.use((error: any,request: Request,response: Response,next: NextFunction) => {
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
			this.server.use((request,response) => {
				const data = interceptor.intercept({ response, request });
				if(data !== undefined) {
					response.status(200).json(data);
				}
			});
		});
	}
	
	public listen(port: number | string, callback: () => void){
		const cors = require("cors");
		if(cors) this.server.use(cors(this.corsOptions));
		this.executeMiddleware();
		this.executeInterceptorBefore();
		this.registerController(this.controllerClasses,this.providers)
		this.executeInterceptorAfter();
		this.catch();
		this.server.listen(port, callback);
	}
}