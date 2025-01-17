import { DECORATOR_KEY } from "../constant/decorator-key";
export function Param(param) {
    return function (target, propertyKey, parameterIndex) {
        const existingParams = Reflect.getMetadata(DECORATOR_KEY.PARAM, target, propertyKey) || [];
        existingParams.push({ param, parameterIndex });
        Reflect.defineMetadata(DECORATOR_KEY.PARAM, existingParams, target, propertyKey);
    };
}
//# sourceMappingURL=Param.js.map