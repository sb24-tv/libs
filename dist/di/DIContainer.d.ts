declare class DIContainer {
    private static instance;
    private services;
    private instances;
    private constructor();
    static getInstance(): DIContainer;
    register<T>(target: {
        new (...args: any[]): T;
    }): void;
    resolve<T>(target: {
        new (...args: any[]): T;
    }): T;
}
export declare const container: DIContainer;
export {};
//# sourceMappingURL=DIContainer.d.ts.map