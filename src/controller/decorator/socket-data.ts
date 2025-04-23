import { DECORATOR_KEY } from "../constant/decorator-key";

export function SocketData() {
	return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
		Reflect.defineMetadata(DECORATOR_KEY.SOCKET_DATA, parameterIndex, target, propertyKey);
	};
}
