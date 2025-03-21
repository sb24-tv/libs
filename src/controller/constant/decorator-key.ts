const DECORATOR_KEY =  {
    CONTROLLER_PATH: Symbol('CONTROLLER_PATH'),
    SK_CONTROLLER_PATH: Symbol('SK_CONTROLLER_PATH'),
    CONTROLLER: Symbol('CONTROLLER'),
    SOCKET: Symbol('SOCKET'),
    PARAM: Symbol('PARAM'),
    ACTION: Symbol('ACTION'),
    METHOD: Symbol('METHOD'),
    ROUTE_PATH: Symbol('ROUTE_PATH'),
    RESPONSE: Symbol('RESPONSE'),
    REQUEST: Symbol('REQUEST'),
    REQUEST_BODY: Symbol('REQUEST_BODY'),
    REQUEST_BODY_TYPE: Symbol('REQUEST_BODY_TYPE'),
    QUERY: Symbol('QUERY'),
    MIDDLEWARE: Symbol('MIDDLEWARE'),
    INTERCEPTOR: Symbol('INTERCEPTOR'),
    BEFORE_INTERCEPTOR: Symbol('BEFORE_INTERCEPTOR'),
    AFTER_INTERCEPTOR: Symbol('AFTER_INTERCEPTOR'),
    FILE_UPLOAD: Symbol('FILE_UPLOAD')
} as const;

export {
    DECORATOR_KEY
}