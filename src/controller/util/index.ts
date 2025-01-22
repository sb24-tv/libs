import path from 'path';
import { NextFunction, Request, Response } from 'express';
import { DECORATOR_KEY } from "../constant/decorator-key";
import { CoreMiddleware, ErrorInterceptor, Interceptor } from "../interface";
import { validate,ValidationError } from "class-validator";

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

/**
 * Loads all exported classes from the given directory.
 */
export function importClassesFromDirectories(directories: string[], formats = ['.js', '.ts', '.tsx']): Function[] {
	const loadFileClasses = function (exported: any, allLoaded: Function[]) {
		if (exported instanceof Function) {
			allLoaded.push(exported);
		} else if (exported instanceof Array) {
			exported.forEach((i: any) => loadFileClasses(i, allLoaded));
		} else if (exported instanceof Object || typeof exported === 'object') {
			Object.keys(exported).forEach(key => loadFileClasses(exported[key], allLoaded));
		}
		
		return allLoaded;
	};
	
	const allFiles = directories.reduce((allDirs, dir) => {
		// Replace \ with / for glob
		return allDirs.concat(require('glob').sync(path.normalize(dir).replace(/\\/g, '/')));
	}, [] as string[]);
	
	const dirs = allFiles
	.filter(file => {
		const dtsExtension = file.substring(file.length - 5, file.length);
		return formats.indexOf(path.extname(file)) !== -1 && dtsExtension !== '.d.ts';
	})
	.map(file => {
		return require(file);
	});
	
	return loadFileClasses(dirs, []);
}

export function HttpMethod(method: HttpMethod, path?: string): MethodDecorator {
	return (target, propertyKey) => {
		Reflect.defineMetadata(DECORATOR_KEY.METHOD, method, target, propertyKey);
		Reflect.defineMetadata(DECORATOR_KEY.ROUTE_PATH, path, target, propertyKey);
	};
}

export function handleDecorators(
	params: {
		controllerInstance: any;
		methodName: string;
		request: Request;
		response: Response;
		next: NextFunction;
	},
	callBack: (data: any) => void,
	validator: (errors: ValidationError[]) => void
) {
	
	const {
		controllerInstance,
		methodName,
		request,
		response,
		next
	} = params;
	
	const method = controllerInstance[methodName];
	const paramsMeta = Reflect.getMetadata(DECORATOR_KEY.PARAM, controllerInstance, methodName) || [];
	const queryMeta = Reflect.getMetadata(DECORATOR_KEY.QUERY, controllerInstance, methodName) || [];
	const resIndex = Reflect.getMetadata(DECORATOR_KEY.RESPONSE, controllerInstance, methodName);
	const reqIndex = Reflect.getMetadata(DECORATOR_KEY.REQUEST, controllerInstance, methodName);
	const reqBodyIndex = Reflect.getMetadata(DECORATOR_KEY.REQUEST_BODY, controllerInstance, methodName);
	
	const args: any[] = [];
	
	// Handle @Param
	paramsMeta.forEach(({ param, parameterIndex }: { param: string, parameterIndex: number }) => {
		args[parameterIndex] = param ? request.params[param] : request.params;
	});
	
	// Handle @Query
	queryMeta.forEach(({ queryKey, queryIndex }: { queryKey: string, queryIndex: number }) => {
		args[queryIndex] = queryKey ? request.query[queryKey] : request.query;
	});
	
	// Handle @Res
	if (resIndex !== undefined) {
		args[resIndex] = response;
	}
	
	if(reqIndex !== undefined) {
		args[reqIndex] = request;
	}
	
	// Handle @Body
	if (reqBodyIndex !== undefined) {
		const ResBodyType = Reflect.getMetadata(DECORATOR_KEY.REQUEST_BODY_TYPE, controllerInstance, methodName);
		
		if(ResBodyType) {
			const validation = new ResBodyType();
			
			for (const key in request.body) {
				validation[key] = request.body[key];
			}
			
			validate(validation).then(errors => {
				if (errors.length > 0) {
					validator(errors);
				}
			});
		}
		
		args[reqBodyIndex] = request.body;
	}
	
	try {
		const result = controllerInstance[methodName](...args);
		// check method is promise
		if (result instanceof Promise) {
			result.then(callBack).catch(next);
		} else if (result !== undefined) {
			callBack(result)
		}
	} catch (error) {
		// apply default response
		method.apply(controllerInstance, args);
	}
}

export function prepareController(controllers: Function[] | string[]) {
	let controllerClasses: Function[] = [];
	if (controllers && controllers.length) {
		controllerClasses = (controllers as any[]).filter(controller => controller instanceof Function);
		const controllerDirs = (controllers as any[]).filter(controller => typeof controller === 'string');
		controllerClasses.push(...importClassesFromDirectories(controllerDirs));
	}
	return controllerClasses;
}

export function isInterceptor(obj: Interceptor): obj is Interceptor {
	return typeof obj.intercept === 'function';
}

export function isInterceptorError(obj: ErrorInterceptor): obj is ErrorInterceptor {
	return typeof obj.catch === 'function';
}

export function isMiddleware(obj: CoreMiddleware): obj is CoreMiddleware {
	return typeof obj.use === 'function';
}