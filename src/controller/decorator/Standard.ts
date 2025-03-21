import { HttpMethod } from "../util";

export const Get = (path?: string) => HttpMethod('get', path);
export const Post = (path?: string) => HttpMethod('post', path);
export const Put = (path?: string) => HttpMethod('put', path);
export const Delete = (path?: string) => HttpMethod('delete', path);
export const Patch = (path?: string) => HttpMethod('patch', path);
export const SocketEvent = (path?: string) => HttpMethod('event', path);