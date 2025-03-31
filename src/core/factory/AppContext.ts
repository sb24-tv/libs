import { Request, Response } from 'express';
import { Interceptor } from "../../controller";
import { eventBus } from "./event-bus";

export default class AppContext {
    
    public interceptor: Interceptor | undefined;
    public request: Request | undefined;
    public response: Response | undefined;
    
    // Example method to send a standard JSON response
    sendJsonResponse(body: any) {
        eventBus.emit('response', body);
    }
    
    onEmitInterceptor(data: any){
        // Emit an event before processing the request
        eventBus.emit("requestReceived", data);
    }
    
    
    start(){
        eventBus.on("requestReceived", (data: any) => {
            this.request = data.request;
            this.response = data.response;
            this.interceptor = data.interceptor;
        });
        
        eventBus.on("response", (agr: any) => {
            const { response ,data,request} = agr;
            const body = this.interceptor ? this.interceptor.intercept(
                {
                    response,
                    request
                },
                data
            ) : data;
            response.status((response as Response).statusCode).json(body);
        });
    }
    
}