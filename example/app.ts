import 'reflect-metadata';
import path from "path";
import { Action, ErrorInterceptor, Injectable, ServerFactory } from "../src";

@Injectable()
class GlobalErrorInterceptor implements ErrorInterceptor  {
	catch({error}: Action) {
		const status = error.statusCode || 500;
		console.error(`[Error] ${error.message}`,error.stack);
		console.error('detail',error.details);
		
		const filteredStack = error.stack
			? error.stack
			.split('\n')
			.filter((line: any) => !line.includes('node_modules')) // Remove node_modules paths
			.join('\n')
			: '';
		
		return {
			status,
			message: error.message || 'Internal Server Error',
			stack: filteredStack,
			details: Array.isArray(error.details) ? error.details.map(function (detail:any) { return detail}) : error.details
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