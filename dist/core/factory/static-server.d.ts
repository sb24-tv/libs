import { Options, OptionsJson, OptionsUrlencoded, OptionsText } from 'body-parser';
import { serverOptions } from "./index";
export declare class CoreApplication {
    private options;
    server: import("express-serve-static-core").Express;
    private controllerClasses;
    private interceptorsBefore;
    private interceptorsAfter;
    private interceptorError;
    private middlewares;
    private providers;
    private appContext;
    constructor(options: serverOptions);
    useGlobalMiddleware(...middlewares: any[]): void;
    useGlobalInterceptors(...interceptors: any[]): void;
    private registerController;
    private instantiateController;
    setBodyParserOptions(options: {
        urlencoded?: OptionsUrlencoded;
        json?: OptionsJson;
        raw?: Options;
        text?: OptionsText;
    }): void;
    private executeInterceptorBefore;
    private executeMiddleware;
    private catch;
    private executeInterceptorAfter;
    listen(port: number | string, callback: () => void): void;
}
