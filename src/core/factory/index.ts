import { CoreApplication } from "./static-server";
import { Server,ServerOptions } from "socket.io";

export type serverOptions = {
	controllers: Function[] | string[],
	providers?: Function[],
	enableLogging?: boolean,
	SocketIO?: typeof Server,
	socketOptions?: ServerOptions
}

export class ServerFactory {
	static createServer(options: serverOptions): CoreApplication {
		return new CoreApplication(options);
	}
}