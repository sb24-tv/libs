import 'reflect-metadata';
import { HttpMethod } from "./util";
export * from './decorator/Controller';

// decorator
export * from './decorator/Res';
export * from './decorator/Req';
export * from './decorator/Param';
export * from './decorator/Body';
export * from './decorator/Query';
export * from './decorator/Middleware';

// utility
export * from './util/index';


// interface

export * from './interface'

export { DECORATOR_KEY } from './constant/decorator-key';

export const Get = (path?: string) => HttpMethod('get', path);
export const Post = (path?: string) => HttpMethod('post', path);
export const Put = (path?: string) => HttpMethod('put', path);
export const Delete = (path?: string) => HttpMethod('delete', path);
export const Patch = (path?: string) => HttpMethod('patch', path);