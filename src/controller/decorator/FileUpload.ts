import { Options } from 'multer';
import {DECORATOR_KEY} from "../constant/decorator-key";

export function FileUpload(options?: Options) {
    return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
        Reflect.defineMetadata(DECORATOR_KEY.FILE_UPLOAD, {
            parameterIndex,
            options
        },target, propertyKey);
    };
}