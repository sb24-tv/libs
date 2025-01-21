import { NextFunction, Request, Response } from 'express';
import { Interceptor } from "../../controller";

export default class AppContext {
    // @ts-ignore
    public interceptor: Interceptor;
    // @ts-ignore
    public request: Request;
    // @ts-ignore
    public response: Response;
    // @ts-ignore
    public next: NextFunction;
    
    setHeader(key: string, value: string): void {
        this.response.setHeader(key, value);
    }
    
    // Example method to send a standard JSON response
    sendJsonResponse(body: any, statusCode = 200) {
        const data = this.interceptor ? this.interceptor.intercept({
            response: this.response,
            request: this.request},
            body) : body;
        this.response.status(statusCode).json(data);
    }
}