import { DECORATOR_KEY } from "../constant/decorator-key";
export function Controller(basePath) {
    return function (target) {
        Reflect.defineMetadata(DECORATOR_KEY.CONTROLLER_PATH, basePath, target);
    };
}
//# sourceMappingURL=Controller.js.map