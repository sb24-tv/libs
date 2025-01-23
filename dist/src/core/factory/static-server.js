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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreApplication = void 0;
const express_1 = __importStar(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const controller_1 = require("../../controller");
const AppContext_1 = __importDefault(require("./AppContext"));
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const http_error_exception_1 = require("../../http-error-exception");
class CoreApplication {
    constructor(options) {
        this.options = options;
        this.server = (0, express_1.default)();
        this.controllerClasses = (0, controller_1.prepareController)(this.options.controllers);
        this.interceptorsBefore = [];
        this.interceptorsAfter = [];
        this.interceptorError = [];
        this.middlewares = [];
        this.providers = this.options.providers;
        this.appContext = new AppContext_1.default();
    }
    useGlobalMiddleware(...middlewares) {
        middlewares.forEach((instance) => {
            const middleware = new instance();
            if ((0, controller_1.isMiddleware)(middleware)) {
                this.middlewares.push(middleware);
            }
        });
    }
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
            if ((0, controller_1.isInterceptorError)(interceptClass)) {
                this.interceptorError.push(interceptClass);
            }
        });
    }
    registerController(controllers, providers) {
        // Create a simple map to store provider instances for injection
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
            if (!basePath) {
                console.warn(`\x1b[43m [Warning] Controller ${ControllerClass.name} is missing a base path. \x1b[0m`);
                continue;
            }
            for (const methodName of methods) {
                if (methodName === "constructor")
                    continue;
                const route = Reflect.getMetadata(controller_1.DECORATOR_KEY.ROUTE_PATH, prototype, methodName) || "";
                const method = Reflect.getMetadata(controller_1.DECORATOR_KEY.METHOD, prototype, methodName);
                if (typeof controllerInstance[methodName] === "function" && method) {
                    // @ts-ignore
                    router[method](route, (request, response, next) => __awaiter(this, void 0, void 0, function* () {
                        const method = controllerInstance[methodName];
                        const paramsMeta = Reflect.getMetadata(controller_1.DECORATOR_KEY.PARAM, controllerInstance, methodName) || [];
                        const queryMeta = Reflect.getMetadata(controller_1.DECORATOR_KEY.QUERY, controllerInstance, methodName) || [];
                        const resIndex = Reflect.getMetadata(controller_1.DECORATOR_KEY.RESPONSE, controllerInstance, methodName);
                        const reqIndex = Reflect.getMetadata(controller_1.DECORATOR_KEY.REQUEST, controllerInstance, methodName);
                        const reqBodyIndex = Reflect.getMetadata(controller_1.DECORATOR_KEY.REQUEST_BODY, controllerInstance, methodName);
                        const args = [];
                        // Handle @Param
                        paramsMeta.forEach(({ param, parameterIndex }) => {
                            args[parameterIndex] = param ? request.params[param] : request.params;
                        });
                        // Handle @Query
                        queryMeta.forEach(({ queryKey, queryIndex }) => {
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
                            const ResBodyType = Reflect.getMetadata(controller_1.DECORATOR_KEY.REQUEST_BODY_TYPE, controllerInstance, methodName);
                            if (ResBodyType) {
                                const instance = (0, class_transformer_1.plainToInstance)(ResBodyType, request.body);
                                const errors = yield (0, class_validator_1.validate)(instance);
                                if (errors.length > 0) {
                                    const error = new http_error_exception_1.HttpError('Validation Error', 403, errors);
                                    error.stack = errors.toString();
                                    return next(error);
                                }
                            }
                            args[reqBodyIndex] = request.body;
                        }
                        const result = controllerInstance[methodName](...args);
                        // check method is promise
                        if (result instanceof Promise) {
                            result.then(this.appContext.sendJsonResponse).catch(next);
                        }
                        else if (result !== undefined) {
                            this.appContext.sendJsonResponse(result);
                        }
                        else {
                            // apply default response
                            method.apply(controllerInstance, args);
                        }
                    }));
                    console.log(`\x1b[32m[Route] ${basePath + route} [Method] ${method.toUpperCase()} [Controller] ${ControllerClass.name}.${methodName}\x1b[0m`);
                }
            }
            // Attach the router to the server
            this.server.use(basePath, router);
        }
    }
    // Helper method to instantiate controllers with injected providers
    instantiateController(ControllerClass, providerInstances) {
        const paramTypes = Reflect.getMetadata("design:paramtypes", ControllerClass) || [];
        const dependencies = paramTypes.map(type => providerInstances.get(type) || null);
        return new ControllerClass(...dependencies);
    }
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
        this.executeMiddleware();
        this.executeInterceptorBefore();
        this.registerController(this.controllerClasses, this.providers);
        this.executeInterceptorAfter();
        this.catch();
        this.server.listen(port, callback);
    }
}
exports.CoreApplication = CoreApplication;
//# sourceMappingURL=static-server.js.map