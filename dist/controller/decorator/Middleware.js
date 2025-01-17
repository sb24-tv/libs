import { DECORATOR_KEY } from "../constant/decorator-key";
export function Middleware(options) {
    return function (target) {
        Reflect.defineMetadata(DECORATOR_KEY.MIDDLEWARE, options, target);
    };
}
//# sourceMappingURL=Middleware.js.map