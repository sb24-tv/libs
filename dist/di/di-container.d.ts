declare class DiContainer {
    private static instance;
    private services;
    private instances;
    static getInstance(): DiContainer;
    register<T>(target: {
        new (...args: any[]): T;
    }): void;
    resolve<T>(target: {
        new (...args: any[]): T;
    }): T;
}
export declare const container: DiContainer;
export {};
