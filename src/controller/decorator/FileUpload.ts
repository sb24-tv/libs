import { Options } from 'multer';
import {DECORATOR_KEY} from "../constant/decorator-key";

/**
 * File upload decorator for Express routes.
 * @param options - Multer configuration options.
 */
export function FileUpload(options: Options): MethodDecorator {
    return (target, propertyKey) => {
        // Reflect.defineMetadata(DECORATOR_KEY.METHOD, method, target, propertyKey);
    };
}
