import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import { createContainer } from './container/container';
import { InversifyRestifyServer } from "inversify-restify-utils";

import { plugins } from "restify";
import queryParser = plugins.queryParser;
import { dbConnection } from "./database/db";
import serveStatic = plugins.serveStatic;

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
		const server = new InversifyRestifyServer(createContainer());
		const app = server.setConfig(app => {

			app.use(bodyParser.urlencoded({ extended: false }));
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
console.log('working');
