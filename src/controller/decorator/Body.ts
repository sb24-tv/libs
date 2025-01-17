import { DECORATOR_KEY } from "../constant/decorator-key";


export function Body() {
	return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
		Reflect.defineMetadata(DECORATOR_KEY.REQUEST_BODY, parameterIndex, target, propertyKey);
	};
}
