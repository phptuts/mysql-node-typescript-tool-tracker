import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import { container } from './container/container';
import { InversifyRestifyServer } from "inversify-restify-utils";

import { plugins } from "restify";
import queryParser = plugins.queryParser;
import { dbConnection } from "./database/db";

class Startup
{

	public server ()
	{
		dbConnection.then(() => {
			this.startExpressServer();
		});
	}

	private startExpressServer ()
	{
		// start the server
		const server = new InversifyRestifyServer(container);
		const app =server.setConfig((app) => {
			app.use(bodyParser.urlencoded({
				extended: true
			}));
			app.use(bodyParser.json());
			app.use(queryParser());
		}).build();


		app.listen(3000, () => {
			console.log('Server started on port 3000 :)');
		});
	}
}

let startup = new Startup();
startup.server();
