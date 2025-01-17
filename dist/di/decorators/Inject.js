import { container } from "../DIContainer";
export function Inject() {
    return (target, propertyKey) => {
        const serviceType = Reflect.getMetadata("design:type", target, propertyKey);
        if (!serviceType) {
            throw new Error(`Cannot resolve type for '${String(propertyKey)}'. Ensure the property type is explicitly defined.`);
        }
        Object.defineProperty(target, propertyKey, {
            get: () => container.resolve(serviceType),
        });
    };
}
//# sourceMappingURL=Inject.js.map