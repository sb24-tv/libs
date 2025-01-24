import { CoreMiddleware, ErrorInterceptor, Interceptor } from "../interface";
type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
/**
 * Loads all exported classes from the given directory.
 */
export declare function importClassesFromDirectories(directories: string[], formats?: string[]): Function[];
export declare function HttpMethod(method: HttpMethod, path?: string): MethodDecorator;
export declare function prepareController(controllers: Function[] | string[]): Function[];
export declare function isInterceptor(obj: Interceptor): obj is Interceptor;
export declare function isInterceptorError(obj: ErrorInterceptor): obj is ErrorInterceptor;
export declare function isMiddleware(obj: CoreMiddleware): obj is CoreMiddleware;
export {};
