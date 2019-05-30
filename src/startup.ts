import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import { createConnection } from 'typeorm'
import { User } from "./entity/user";
import { CheckoutHistory } from "./entity/checkout-history";
import { Item } from "./entity/item";
import { Catalog } from "./entity/catalog";
import { CatalogStatus } from "./entity/catalog-status";
import { ItemStatus } from "./entity/item-status";
import { container } from './container/container';
import { InversifyRestifyServer } from "inversify-restify-utils";

import dotenv  from 'dotenv';
dotenv.config();

class Startup
{

	public server ()
	{

		// create database connection
		createConnection({
			type: "mysql",
			host: "localhost",
			port: 3306,
			username: "root",
			password: "",
			database: "tool-tracker",
			entities: [
				User,
				CheckoutHistory,
				Item,
				Catalog,
				CatalogStatus,
				ItemStatus
			],
			synchronize: true,
			logging: true
		}) .then(() => {
			this.startExpressServer();
		});
	}

	private startExpressServer ()
	{
		// start the server
		let server = new InversifyRestifyServer(container);
		server.setConfig((app) => {
			app.use(bodyParser.urlencoded({
				extended: true
			}));
			app.use(bodyParser.json());

		});

		let app = server.build();
		app.listen(3000, () => {
			console.log('Server started on port 3000 :)');
		});
	}
}

let startup = new Startup();
startup.server();
