"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = Body;
const decorator_key_1 = require("../constant/decorator-key");
function Body() {
    return function (target, propertyKey, parameterIndex) {
        Reflect.defineMetadata(decorator_key_1.DECORATOR_KEY.REQUEST_BODY, parameterIndex, target, propertyKey);
    };
}
