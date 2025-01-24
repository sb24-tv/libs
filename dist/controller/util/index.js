"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importClassesFromDirectories = importClassesFromDirectories;
exports.HttpMethod = HttpMethod;
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
