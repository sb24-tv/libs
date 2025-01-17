import { DECORATOR_KEY } from "../constant/decorator-key";
export function Res() {
    return function (target, propertyKey, parameterIndex) {
        Reflect.defineMetadata(DECORATOR_KEY.RESPONSE, parameterIndex, target, propertyKey);
    };
}
//# sourceMappingURL=Res.js.map