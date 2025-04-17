"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = Request;
const decorator_key_1 = require("../constant/decorator-key");
function Request() {
    return (target, propertyKey, parameterIndex) => {
        Reflect.defineMetadata(decorator_key_1.DECORATOR_KEY.REQUEST, parameterIndex, target, propertyKey);
    };
}
