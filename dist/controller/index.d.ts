import 'reflect-metadata';
export * from './decorator/Controller';
export * from './decorator/Res';
export * from './decorator/Req';
export * from './decorator/Param';
export * from './decorator/Body';
export * from './decorator/Query';
export * from './decorator/Middleware';
export * from './util/index';
export * from './interface';
export { DECORATOR_KEY } from './constant/decorator-key';
export declare const Get: (path?: string) => MethodDecorator;
export declare const Post: (path?: string) => MethodDecorator;
export declare const Put: (path?: string) => MethodDecorator;
export declare const Delete: (path?: string) => MethodDecorator;
export declare const Patch: (path?: string) => MethodDecorator;
//# sourceMappingURL=index.d.ts.map