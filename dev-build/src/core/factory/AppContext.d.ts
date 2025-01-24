import { NextFunction, Request, Response } from 'express';
import { Interceptor } from "../../controller";
export default class AppContext {
    interceptor: Interceptor;
    request: Request;
    response: Response;
    next: NextFunction;
    setHeader(key: string, value: string): void;
    sendJsonResponse(body: any, statusCode?: number): void;
}
