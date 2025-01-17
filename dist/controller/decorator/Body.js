import { DECORATOR_KEY } from "../constant/decorator-key";
export function Body() {
    return function (target, propertyKey, parameterIndex) {
        Reflect.defineMetadata(DECORATOR_KEY.REQUEST_BODY, parameterIndex, target, propertyKey);
    };
}
//# sourceMappingURL=Body.js.map