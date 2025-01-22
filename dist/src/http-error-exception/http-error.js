"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor); // Maintain proper stack trace
    }
}
exports.HttpError = HttpError;
//# sourceMappingURL=http-error.js.map