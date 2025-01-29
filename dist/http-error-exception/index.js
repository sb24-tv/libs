"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayTimeoutError = exports.ServiceUnavailableError = exports.TooManyRequestsError = exports.UnprocessableEntityError = exports.UnauthorizedError = exports.ForbiddenError = exports.NotFoundError = exports.BadRequestError = exports.ConflictError = exports.InternalServerError = exports.HttpError = void 0;
const http_error_1 = __importDefault(require("./http-error"));
exports.HttpError = http_error_1.default;
class BadRequestError extends http_error_1.default {
    constructor(message = "Bad Request", details) {
        super(message, 400, details);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends http_error_1.default {
    constructor(message = "Unauthorized", details) {
        super(message, 401, details);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends http_error_1.default {
    constructor(message = "Forbidden", details) {
        super(message, 403, details);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends http_error_1.default {
    constructor(message = "Not Found", details) {
        super(message, 404, details);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends http_error_1.default {
    constructor(message = "Conflict", details) {
        super(message, 409, details);
    }
}
exports.ConflictError = ConflictError;
class InternalServerError extends http_error_1.default {
    constructor(message = "Internal Server Error", details) {
        super(message, 500, details);
    }
}
exports.InternalServerError = InternalServerError;
class UnprocessableEntityError extends http_error_1.default {
    constructor(message = "Unprocessable Entity", details) {
        super(message, 422, details);
    }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
class TooManyRequestsError extends http_error_1.default {
    constructor(message = "Too Many Requests", details) {
        super(message, 429, details);
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
class ServiceUnavailableError extends http_error_1.default {
    constructor(message = "Service Unavailable", details) {
        super(message, 503, details);
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
class GatewayTimeoutError extends http_error_1.default {
    constructor(message = "Gateway Timeout", details) {
        super(message, 504, details);
    }
}
exports.GatewayTimeoutError = GatewayTimeoutError;
