import { DECORATOR_KEY } from "../constant/decorator-key";
export function Query(queryKey) {
    return function (target, propertyKey, queryIndex) {
        const existingQuery = Reflect.getMetadata(DECORATOR_KEY.QUERY, target, propertyKey) || [];
        existingQuery.push({ queryKey, queryIndex });
        Reflect.defineMetadata(DECORATOR_KEY.QUERY, existingQuery, target, propertyKey);
    };
}
//# sourceMappingURL=Query.js.map