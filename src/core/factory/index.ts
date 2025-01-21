import { CoreApplication } from "./static-server";


export type serverOptions = {
	controllers: Function[] | string[],
	providers?: Function[]
}

export class ServerFactory {
	static createServer(options: serverOptions): CoreApplication {
		return new CoreApplication(options);
	}
}