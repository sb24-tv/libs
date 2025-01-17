import { NextFunction, Request,Response} from 'express';

export interface Action {
	request: Request;
	response: Response;
	next: NextFunction;
	error: any;
}

export interface Interceptor {
	intercept(context: Pick<Action, "request" | "response">,content?: any): object;
}

export interface ErrorInterceptor {
	catch(context: Action): object;
}

export interface CoreMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}