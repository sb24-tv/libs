class DIContainer {
	private static instance: DIContainer;
	private services = new Map<any, any>(); // Maps classes to their implementations
	private instances = new Map<any, any>(); // Maps classes to their singleton instances
	
	private constructor() {} // Prevent direct instantiation
	
	static getInstance(): DIContainer {
		if (!DIContainer.instance) {
			DIContainer.instance = new DIContainer();
		}
		return DIContainer.instance;
	}
	
	register<T>(target: { new (...args: any[]): T },): void {
		this.services.set(target, target);
	}
	
	resolve<T>(target: { new(...args: any[]): T }): T {
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
		const dependencies = paramTypes.map((dependency: any) =>
			this.resolve(dependency)
		);
	
		// Create a new instance and cache it
		const instance = new implementation(...dependencies);
		this.instances.set(target, instance);
		
		return instance;
	}
}
// Get the singleton instance of the DIContainer
export const container = DIContainer.getInstance();
