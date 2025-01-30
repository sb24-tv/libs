import { CoreApplication } from "./static-server";
export type serverOptions = {
    controllers: Function[] | string[];
    providers?: Function[];
    enableLogging?: boolean;
};
export declare class ServerFactory {
    static createServer(options: serverOptions): CoreApplication;
    static createMicroservice(options: serverOptions): void;
}
