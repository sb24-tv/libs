"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importClassesFromDirectories = importClassesFromDirectories;
exports.HttpMethod = HttpMethod;
exports.handleDecorators = handleDecorators;
exports.prepareController = prepareController;
exports.isInterceptor = isInterceptor;
exports.isInterceptorError = isInterceptorError;
exports.isMiddleware = isMiddleware;
const path_1 = __importDefault(require("path"));
const decorator_key_1 = require("../constant/decorator-key");
/**
 * Loads all exported classes from the given directory.
 */
function importClassesFromDirectories(directories, formats = ['.js', '.ts', '.tsx']) {
    const loadFileClasses = function (exported, allLoaded) {
        if (exported instanceof Function) {
            allLoaded.push(exported);
        }
        else if (exported instanceof Array) {
            exported.forEach((i) => loadFileClasses(i, allLoaded));
        }
        else if (exported instanceof Object || typeof exported === 'object') {
            Object.keys(exported).forEach(key => loadFileClasses(exported[key], allLoaded));
        }
        return allLoaded;
    };
    const allFiles = directories.reduce((allDirs, dir) => {
        // Replace \ with / for glob
        return allDirs.concat(require('glob').sync(path_1.default.normalize(dir).replace(/\\/g, '/')));
    }, []);
    const dirs = allFiles
        .filter(file => {
        const dtsExtension = file.substring(file.length - 5, file.length);
        return formats.indexOf(path_1.default.extname(file)) !== -1 && dtsExtension !== '.d.ts';
    })
        .map(file => {
        return require(file);
    });
    return loadFileClasses(dirs, []);
}
function HttpMethod(method, path) {
    return (target, propertyKey) => {
        Reflect.defineMetadata(decorator_key_1.DECORATOR_KEY.METHOD, method, target, propertyKey);
        Reflect.defineMetadata(decorator_key_1.DECORATOR_KEY.ROUTE_PATH, path, target, propertyKey);
    };
}
function handleDecorators(params, callBack) {
    const { controllerInstance, methodName, request, response, next } = params;
    const method = controllerInstance[methodName];
    const paramsMeta = Reflect.getMetadata(decorator_key_1.DECORATOR_KEY.PARAM, controllerInstance, methodName) || [];
    const queryMeta = Reflect.getMetadata(decorator_key_1.DECORATOR_KEY.QUERY, controllerInstance, methodName) || [];
    const resIndex = Reflect.getMetadata(decorator_key_1.DECORATOR_KEY.RESPONSE, controllerInstance, methodName);
    const reqIndex = Reflect.getMetadata(decorator_key_1.DECORATOR_KEY.REQUEST, controllerInstance, methodName);
    const reqBodyIndex = Reflect.getMetadata(decorator_key_1.DECORATOR_KEY.REQUEST_BODY, controllerInstance, methodName);
    const args = [];
    // Handle @Param
    paramsMeta.forEach(({ param, parameterIndex }) => {
        args[parameterIndex] = param ? request.params[param] : request.params;
    });
    // Handle @Query
    queryMeta.forEach(({ queryKey, queryIndex }) => {
        args[queryIndex] = queryKey ? request.query[queryKey] : request.query;
    });
    // Handle @Body
    if (reqBodyIndex !== undefined) {
        args[reqBodyIndex] = request.body;
    }
    // Handle @Res
    if (resIndex !== undefined) {
        args[resIndex] = response;
    }
    if (reqIndex !== undefined) {
        args[reqIndex] = request;
    }
    try {
        const result = controllerInstance[methodName](...args);
        if (result instanceof Promise) {
            result.then(callBack).catch(next);
        }
        else if (result !== undefined) {
            callBack(result);
        }
    }
    catch (error) {
        method.apply(controllerInstance, args);
    }
}
function prepareController(controllers) {
    let controllerClasses = [];
    if (controllers && controllers.length) {
        controllerClasses = controllers.filter(controller => controller instanceof Function);
        const controllerDirs = controllers.filter(controller => typeof controller === 'string');
        controllerClasses.push(...importClassesFromDirectories(controllerDirs));
    }
    return controllerClasses;
}
function isInterceptor(obj) {
    return typeof obj.intercept === 'function';
}
function isInterceptorError(obj) {
    return typeof obj.catch === 'function';
}
function isMiddleware(obj) {
    return typeof obj.use === 'function';
}
