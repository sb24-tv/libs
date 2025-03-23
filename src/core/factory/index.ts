import { CoreApplication } from "./static-server";
import { Server,ServerOptions } from "socket.io";
import {Socket,ExtendedError} from "socket.io";


export type serverOptions = {
	controllers: Function[] | string[],
	providers?: Function[],
	enableLogging?: boolean,
	SocketIO?: typeof Server,
	socketOptions?: ServerOptions,
	socketMiddleware?: (socket: Socket,next: (err?: ExtendedError) => void) => void
}

export class ServerFactory {
	static createServer(options: serverOptions): CoreApplication {
		return new CoreApplication(options);
	}
}