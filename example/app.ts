import 'reflect-metadata';
import path from "path";
import { ServerFactory } from "../src";

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

const PORT = 3100;
app.listen(PORT, () => {
	console.log(`Worker ${process.pid} started on http://localhost:${PORT}`);
});