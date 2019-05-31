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
import { plugins } from "restify";
import queryParser = plugins.queryParser;
dotenv.config();

class Startup
{

	public server ()
	{
		// create database connection
		createConnection({
			type: "mysql",
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT),
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: "tool-tracker",
			entities: [
				User,
				CheckoutHistory,
				Item,
				Catalog,
				CatalogStatus,
				ItemStatus
			],
			bigNumberStrings: false, // This is to prevent the orm from serializing number to string
			synchronize: true,
			logging: true
		}) .then(() => {
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
