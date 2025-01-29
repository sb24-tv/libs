import HttpError from "./http-error";

class BadRequestError extends HttpError {
	constructor(message = "Bad Request", details?: any) {
		super(message, 400, details);
	}
}

class UnauthorizedError extends HttpError {
	constructor(message = "Unauthorized", details?: any) {
		super(message, 401, details);
	}
}

class ForbiddenError extends HttpError {
	constructor(message = "Forbidden", details?: any) {
		super(message, 403, details);
	}
}

class NotFoundError extends HttpError {
	constructor(message = "Not Found", details?: any) {
		super(message, 404, details);
	}
}

class ConflictError extends HttpError {
	constructor(message = "Conflict", details?: any) {
		super(message, 409, details);
	}
}

class InternalServerError extends HttpError {
	constructor(message = "Internal Server Error", details?: any) {
		super(message, 500, details);
	}
}

class UnprocessableEntityError extends HttpError {
	constructor(message = "Unprocessable Entity", details?: any) {
		super(message, 422, details);
	}
}

class TooManyRequestsError extends HttpError {
	constructor(message = "Too Many Requests", details?: any) {
		super(message, 429, details);
	}
}


class ServiceUnavailableError extends HttpError {
	constructor(message = "Service Unavailable", details?: any) {
		super(message, 503, details);
	}
}

class GatewayTimeoutError extends HttpError {
	constructor(message = "Gateway Timeout", details?: any) {
		super(message, 504, details);
	}
}

export {
	HttpError,
	InternalServerError,
	ConflictError,
	BadRequestError,
	NotFoundError,
	ForbiddenError,
	UnauthorizedError,
	UnprocessableEntityError,
	TooManyRequestsError,
	ServiceUnavailableError,
	GatewayTimeoutError
}