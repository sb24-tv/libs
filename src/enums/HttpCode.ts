export enum HttpStatusCode {
    // Create
    CREATED = 201,
    BAD_REQUEST = 400,
    CONFLICT = 409,
    
    // Read
    OK = 200,
    NOT_FOUND = 404,
    
    // Update
    NO_CONTENT = 204,
    
    // Delete
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    INTERNAL_SERVER_ERROR = 500,
}
