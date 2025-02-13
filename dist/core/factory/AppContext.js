"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_bus_1 = require("./event-bus");
class AppContext {
    // Example method to send a standard JSON response
    sendJsonResponse(body) {
        event_bus_1.eventBus.emit('response', body);
    }
    reset() {
        this.interceptor = undefined;
        this.request = undefined;
        this.response = undefined;
    }
    onEmitInterceptor(data) {
        // Emit an event before processing the request
        event_bus_1.eventBus.emit("requestReceived", data);
    }
    start() {
        event_bus_1.eventBus.on("requestReceived", (data) => {
            this.request = data.request;
            this.response = data.response;
            this.interceptor = data.interceptor;
        });
        event_bus_1.eventBus.on("response", (agr) => {
            const { response, data, request } = agr;
            const body = this.interceptor ? this.interceptor.intercept({
                response,
                request
            }, data) : data;
            response.status(200).json(body);
            this.reset();
        });
    }
}
exports.default = AppContext;
