import path from 'path';
import { DECORATOR_KEY } from "../constant/decorator-key";
import { CoreMiddleware, ErrorInterceptor, Interceptor } from "../interface";

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