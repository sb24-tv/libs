"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inject = Inject;
const DIContainer_1 = require("../DIContainer");
function Inject() {
    return (target, propertyKey) => {
        const serviceType = Reflect.getMetadata("design:type", target, propertyKey);
        if (!serviceType) {
            throw new Error(`Cannot resolve type for '${String(propertyKey)}'. Ensure the property type is explicitly defined.`);
        }
        Object.defineProperty(target, propertyKey, {
            get: () => DIContainer_1.container.resolve(serviceType),
        });
    };
}
//# sourceMappingURL=Inject.js.map