import 'reflect-metadata';
import path from "path";
import {
	Action,
	ErrorInterceptor,
	Injectable,
	Interceptor,
	ServerFactory
} from "../src";
import dotenv from "dotenv";
dotenv.config();

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
			details: Array.isArray(error.details) ? error.details.map(function (detail: any) { return detail }) : error.details
		};
	}
}

@Injectable()
export class Service {

	async create() {
		return "Service created";
	}

	update(_data: any) {
       return "Service updated";
    }

}

@Injectable({type: 'AFTER'})
export class NotFoundInterceptor implements Interceptor {

	intercept(action: Action){
		return {
			message: 'Route Not Found',
			method: action.request.method,
			route: action.request.path,
			success: false,
			statusCode: 404
		};
	}
}
@Injectable()
export class ResponseTransformerInterceptor implements Interceptor  {
	
	intercept(action: Action,data: any){
		const before = Date.now();
		return {
			data,
			duration: `${Date.now() - before}ms`,
			method: action.request.method,
			route: action.request.path,
			success: true,
			statusCode: action.response.statusCode
		};
	}
}

const app = ServerFactory.createServer({
	controllers: [
		path.join(__dirname, './controllers/**/*.{js,ts}'),
	],
	providers: [
        Service,
    ],
	enableLogging: true
});

app.enableCors({
	credentials: true,
	origin: '*'
});

app.setBodyParserOptions({
	urlencoded: {
		extended: false,
	}
});

app.setGlobalPrefix('/api/v1');
app.useGlobalInterceptors(
	ResponseTransformerInterceptor,
	GlobalErrorInterceptor,
	NotFoundInterceptor
);

const PORT = 3100;
app.listen(PORT, () => {
	console.log(`Worker ${process.pid} started on http://localhost:${PORT}`);
});

(async function () {
	
	const dd = await fetch('http://localhost:3100/api/v1/role').then(response => response.json());
	// const dddd = await fetch('http://localhost:3100/api/v1/role/dd').then(response => response.json());
	//
	// console.log(dd,dddd)
})()
