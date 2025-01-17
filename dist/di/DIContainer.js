"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
class DIContainer {
    constructor() {
        this.services = new Map(); // Maps classes to their implementations
        this.instances = new Map(); // Maps classes to their singleton instances
    } // Prevent direct instantiation
    static getInstance() {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }
    register(target) {
        this.services.set(target, target);
    }
    resolve(target) {
        // Check if an instance already exists
        if (this.instances.has(target)) {
            return this.instances.get(target);
        }
        // Resolve the class implementation
        const implementation = this.services.get(target);
        if (!implementation) {
            throw new Error(`Service '${target.name}' is not registered.`);
        }
        // Get constructor parameter types (dependencies)
        const paramTypes = Reflect.getMetadata("design:paramtypes", target) || [];
        const dependencies = paramTypes.map((dependency) => this.resolve(dependency));
        // Create a new instance and cache it
        const instance = new implementation(...dependencies);
        this.instances.set(target, instance);
        return instance;
    }
}
// Get the singleton instance of the DIContainer
exports.container = DIContainer.getInstance();
//# sourceMappingURL=DIContainer.js.map