import 'reflect-metadata';
import { Action, ErrorInterceptor } from "../src";
export declare class GlobalErrorInterceptor implements ErrorInterceptor {
    catch({ error }: Action): {
        status: any;
        message: any;
        details: any;
    };
}
