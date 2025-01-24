"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
const src_1 = require("../src");
let GlobalErrorInterceptor = class GlobalErrorInterceptor {
    catch({ error }) {
        const status = error.statusCode || 500;
        console.error(`[Error] ${error.message}`, error.stack);
        console.error('detail', error.details);
        const filteredStack = error.stack
            ? error.stack
                .split('\n')
                .filter((line) => !line.includes('node_modules')) // Remove node_modules paths
                .join('\n')
            : '';
        return {
            status,
            message: error.message || 'Internal Server Error',
            stack: filteredStack,
            details: Array.isArray(error.details) ? error.details.map(function (detail) { return detail; }) : error.details
        };
    }
};
GlobalErrorInterceptor = __decorate([
    (0, src_1.Injectable)()
], GlobalErrorInterceptor);
let Service = class Service {
    create() {
        return "Service created";
    }
    update(data) {
        return "Service updated";
    }
};
exports.Service = Service;
exports.Service = Service = __decorate([
    (0, src_1.Injectable)()
], Service);
const app = src_1.ServerFactory.createServer({
    controllers: [
        path_1.default.join(__dirname, './controllers/**/*.{js,ts}'),
    ],
    providers: [
        Service,
    ]
});
app.setBodyParserOptions({
    urlencoded: {
        extended: false,
    }
});
app.useGlobalInterceptors(GlobalErrorInterceptor);
const PORT = 3100;
app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started on http://localhost:${PORT}`);
});
