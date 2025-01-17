import { container } from "../DIContainer";
import { DECORATOR_KEY } from "../../controller";
export function Injectable(options) {
    return (target) => {
        const classMethods = Object.getOwnPropertyNames(target.prototype);
        container.register(target); // register dependencies injection
        // register interceptors and middleware if defined
        if (classMethods.includes('intercept') || classMethods.includes('catch')) {
            switch (options === null || options === void 0 ? void 0 : options.type) {
                case 'AFTER':
                    Reflect.defineMetadata(DECORATOR_KEY.AFTER_INTERCEPTOR, DECORATOR_KEY.AFTER_INTERCEPTOR, target);
                    break;
                default:
                    Reflect.defineMetadata(DECORATOR_KEY.BEFORE_INTERCEPTOR, DECORATOR_KEY.BEFORE_INTERCEPTOR, target);
                    break;
            }
        }
        if (classMethods.includes('use')) {
            const value = options && (options === null || options === void 0 ? void 0 : options.middlewareIndex);
            Reflect.defineMetadata(DECORATOR_KEY.MIDDLEWARE, value, target);
        }
    };
}
//# sourceMappingURL=Injectable.js.map