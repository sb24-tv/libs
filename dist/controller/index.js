"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patch = exports.Delete = exports.Put = exports.Post = exports.Get = exports.DECORATOR_KEY = void 0;
require("reflect-metadata");
const util_1 = require("./util");
__exportStar(require("./decorator/Controller"), exports);
// decorator
__exportStar(require("./decorator/Res"), exports);
__exportStar(require("./decorator/Req"), exports);
__exportStar(require("./decorator/Param"), exports);
__exportStar(require("./decorator/Body"), exports);
__exportStar(require("./decorator/Query"), exports);
__exportStar(require("./decorator/Middleware"), exports);
// utility
__exportStar(require("./util/index"), exports);
// interface
__exportStar(require("./interface"), exports);
var decorator_key_1 = require("./constant/decorator-key");
Object.defineProperty(exports, "DECORATOR_KEY", { enumerable: true, get: function () { return decorator_key_1.DECORATOR_KEY; } });
const Get = (path) => (0, util_1.HttpMethod)('get', path);
exports.Get = Get;
const Post = (path) => (0, util_1.HttpMethod)('post', path);
exports.Post = Post;
const Put = (path) => (0, util_1.HttpMethod)('put', path);
exports.Put = Put;
const Delete = (path) => (0, util_1.HttpMethod)('delete', path);
exports.Delete = Delete;
const Patch = (path) => (0, util_1.HttpMethod)('patch', path);
exports.Patch = Patch;
