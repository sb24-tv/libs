import { DECORATOR_KEY } from "../constant/decorator-key";
export function Req() {
    return (target, propertyKey, parameterIndex) => {
        Reflect.defineMetadata(DECORATOR_KEY.REQUEST, parameterIndex, target, propertyKey);
    };
}
//# sourceMappingURL=Req.js.map