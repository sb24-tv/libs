import { Request, Response } from 'express';
import { Interceptor } from "../../controller";
export default class AppContext {
    interceptor: Interceptor | undefined;
    request: Request | undefined;
    response: Response | undefined;
    sendJsonResponse(body: any): void;
    private reset;
    onEmitInterceptor(data: any): void;
    start(): void;
}
