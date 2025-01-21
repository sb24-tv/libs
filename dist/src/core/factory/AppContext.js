"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppContext {
    setHeader(key, value) {
        this.response.setHeader(key, value);
    }
    // Example method to send a standard JSON response
    sendJsonResponse(body, statusCode = 200) {
        const data = this.interceptor ? this.interceptor.intercept({
            response: this.response,
            request: this.request
        }, body) : body;
        this.response.status(statusCode).json(data);
    }
}
exports.default = AppContext;
//# sourceMappingURL=AppContext.js.map