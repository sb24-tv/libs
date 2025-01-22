import 'reflect-metadata';
import path from "path";
import { Action, ErrorInterceptor, Injectable, ServerFactory } from "../src";
@Injectable()
export class GlobalErrorInterceptor implements ErrorInterceptor  {
	catch({error}: Action) {
		const status = error.statusCode || 500;
		console.error(`[Error] ${error.message}`,error.stack);
		return {
			status,
			message: error.message || 'Internal Server Error',
			details: error.stack
		};
	}
}
const app = ServerFactory.createServer({
	controllers: [
		path.join(__dirname, './controllers/**/*.{js,ts}'),
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