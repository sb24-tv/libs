"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
const src_1 = require("../src");
const app = src_1.ServerFactory.createServer({
    controllers: [
        path_1.default.join(__dirname, './controllers/**/*.{js,ts}'),
    ]
});
app.setBodyParserOptions({
    urlencoded: {
        extended: false,
    }
});
const PORT = 3100;
app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started on http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map