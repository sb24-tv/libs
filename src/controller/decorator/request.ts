import { DECORATOR_KEY } from "../constant/decorator-key";

export function Request() {
	return (target: any, propertyKey: string, parameterIndex: number) => {
		Reflect.defineMetadata(DECORATOR_KEY.REQUEST, parameterIndex, target, propertyKey);
	};
}
