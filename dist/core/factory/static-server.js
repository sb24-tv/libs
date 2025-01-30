"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreApplication = void 0;
const express_1 = __importStar(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const controller_1 = require("../../controller");
const AppContext_1 = __importDefault(require("./AppContext"));
const multer_1 = __importDefault(require("multer"));
class CoreApplication {
    constructor(options) {
        this.options = options;
        this.server = (0, express_1.default)();
        this.corsOptions = {};
        this.controllerClasses = (0, controller_1.prepareController)(this.options.controllers);
        this.interceptorsBefore = [];
        this.interceptorsAfter = [];
        this.interceptorError = [];
        this.middlewares = [];
        this.providers = this.options.providers;
        this.appContext = new AppContext_1.default();
        this.excludePrefix = [];
    }
    /**
     * Registers global middleware functions to be used by the application.
     * Each middleware is instantiated and added to the middleware stack if it meets the criteria.
     *
     * @param middlewares - A list of middleware classes to be instantiated and used globally.
     * Each middleware should be a class that can be instantiated.
     */
    useGlobalMiddleware(...middlewares) {
        middlewares.forEach((instance) => {
            const middleware = new instance();
            if ((0, controller_1.isMiddleware)(middleware)) {
                this.middlewares.push(middleware);
            }
        });
    }
    enableCors(options) {
        this.corsOptions = options;
    }
    /**
     * Sets a global prefix for all routes in the application.
     * This prefix will be prepended to all controller paths unless specified in the exclude list.
     *
     * @param prefix - The global prefix to be applied to all routes.
     * @param excludePrefix - An optional array of route paths that should not have the global prefix applied.
     */
    setGlobalPrefix(prefix, excludePrefix) {
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
    useGlobalInterceptors(...interceptors) {
        interceptors.forEach((instance) => {
            const after = Reflect.getMetadata(controller_1.DECORATOR_KEY.AFTER_INTERCEPTOR, instance);
            const before = Reflect.getMetadata(controller_1.DECORATOR_KEY.BEFORE_INTERCEPTOR, instance);
            const interceptClass = new instance();
            if ((0, controller_1.isInterceptor)(interceptClass)) {
                if (after)
                    this.interceptorsAfter.push(interceptClass);
                if (before)
                    this.interceptorsBefore.push(interceptClass);
            }
            if ((0, controller_1.isInterceptorError)(interceptClass))
                this.interceptorError.push(interceptClass);
        });
    }
    registerController(controllers, providers) {
        var _a;
        // 	try {
        const providerInstances = new Map();
        if (providers) {
            for (const ProviderClass of providers) {
                // @ts-ignore
                providerInstances.set(ProviderClass, new ProviderClass());
            }
        }
        for (const ControllerClass of controllers) {
            const router = (0, express_1.Router)();
            // Inject providers into the controller constructor
            const controllerInstance = this.instantiateController(ControllerClass, providerInstances);
            const prototype = Object.getPrototypeOf(controllerInstance);
            const methods = Object.getOwnPropertyNames(prototype);
            const basePath = Reflect.getMetadata(controller_1.DECORATOR_KEY.CONTROLLER_PATH, ControllerClass);
            const isController = Reflect.getMetadata(controller_1.DECORATOR_KEY.CONTROLLER, ControllerClass);
            if (isController !== controller_1.DECORATOR_KEY.CONTROLLER)
                continue;
            if (!basePath) {
                console.warn(`\x1b[43m [Warning] Controller ${ControllerClass.name} is missing a base path. \x1b[0m`);
                continue;
            }
            const routePath = ((_a = this.excludePrefix) === null || _a === void 0 ? void 0 : _a.includes(basePath)) ? basePath : this.prefix ? this.prefix + basePath : basePath;
            for (const methodName of methods) {
                if (methodName === "constructor")
                    continue;
                const route_path = Reflect.getMetadata(controller_1.DECORATOR_KEY.ROUTE_PATH, prototype, methodName) || "";
                const classMethod = Reflect.getMetadata(controller_1.DECORATOR_KEY.METHOD, prototype, methodName);
                if (typeof controllerInstance[methodName] === "function" && classMethod) {
                    const fileUpload = Reflect.getMetadata(controller_1.DECORATOR_KEY.FILE_UPLOAD, controllerInstance, methodName);
                    const args = [route_path];
                    if (fileUpload) {
                        const { keyField, storage, type, limits, dest, preservePath, fileFilter, maxCount } = fileUpload.options;
                        const upload = (0, multer_1.default)({
                            dest,
                            storage,
                            limits,
                            preservePath,
                            fileFilter
                        });
                        switch (type) {
                            case "single":
                                if (typeof keyField === "string") {
                                    args.push(upload.single(keyField));
                                }
                                break;
                            case "array":
                                if (typeof keyField === "string") {
                                    args.push(upload.array(keyField, maxCount));
                                }
                                break;
                            case "fields":
                                if (Array.isArray(keyField)) {
                                    args.push(upload.fields(keyField));
                                }
                                break;
                            case "any":
                                args.push(upload.any());
                                break;
                            case "none":
                                args.push(upload.none());
                                break;
                        }
                    }
                    args.push(controller_1.executeRoute.bind({
                        controllerInstance,
                        methodName,
                        appContext: this.appContext
                    }));
                    // @ts-ignore
                    router[classMethod](...args);
                    if (this.options.enableLogging) {
                        console.log(`\x1b[32m[Route] ${routePath} [Method] ${classMethod.toUpperCase()} [Controller] ${ControllerClass.name}.${methodName}\x1b[0m`);
                    }
                }
            }
            this.server.use(routePath, router);
        }
    }
    // Helper method to instantiate controllers with injected providers
    instantiateController(ControllerClass, providerInstances) {
        const paramTypes = Reflect.getMetadata("design:paramtypes", ControllerClass) || [];
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
    setBodyParserOptions(options) {
        this.server.use(express_1.default.json());
        for (let key in options) {
            // @ts-ignore
            this.server.use(body_parser_1.default[key](options[key]));
        }
    }
    executeInterceptorBefore() {
        if (this.interceptorsBefore.length > 0) {
            this.interceptorsBefore.forEach((interceptor) => {
                this.server.use((request, response, next) => {
                    this.appContext.interceptor = interceptor;
                    this.appContext.request = request;
                    this.appContext.response = response;
                    next();
                });
            });
        }
        else {
            this.server.use((request, response, next) => {
                this.appContext.request = request;
                this.appContext.response = response;
                next();
            });
        }
    }
    executeMiddleware() {
        this.middlewares.forEach(middleware => {
            this.server.use(middleware.use);
        });
    }
    catch() {
        this.interceptorError.forEach((instance) => {
            this.server.use((error, request, response, next) => {
                const data = instance.catch({
                    error,
                    request,
                    response,
                    next
                });
                if (data !== undefined) {
                    response.status(200).json(data);
                }
            });
        });
    }
    executeInterceptorAfter() {
        this.interceptorsAfter.forEach(interceptor => {
            this.server.use((request, response) => {
                const data = interceptor.intercept({ response, request });
                if (data !== undefined) {
                    response.status(200).json(data);
                }
            });
        });
    }
    listen(port, callback) {
        const cors = require("cors");
        if (cors)
            this.server.use(cors(this.corsOptions));
        this.executeMiddleware();
        this.executeInterceptorBefore();
        this.registerController(this.controllerClasses, this.providers);
        this.executeInterceptorAfter();
        this.catch();
        this.server.listen(port, callback);
    }
}
exports.CoreApplication = CoreApplication;
