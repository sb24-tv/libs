import { CoreApplication } from "./static-server";
export type serverOptions = {
    controllers: Function[] | string[];
    providers?: Function[];
};
export declare class ServerFactory {
    static createServer(options: serverOptions): CoreApplication;
}
