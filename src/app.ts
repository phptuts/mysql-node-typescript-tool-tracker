import "reflect-metadata";
import { createConnection, getConnection, getCustomRepository, getRepository } from "typeorm";
import { User } from "./entity/user";
import { CheckoutHistory } from "./entity/checkout-history";
import { Item } from "./entity/item";
import { Catalog } from "./entity/catalog";
import express from 'express';

const app = express();


import dotenv  from 'dotenv';
import { CatalogStatus } from "./entity/catalog-status";
import { ItemStatus } from "./entity/item-status";
import { CatalogStatusService } from "./service/catalog-status.service";
import { container } from "./container/container";
import { TYPES } from "./container/types";
dotenv.config();


app.get('/items', async (req, res) => {

	const term = req.query.term || '';

	const page = parseInt(req.query.page) || 1;

	const availableOnly = req.query.availableOnly || false;

	const catalogService = container.get<CatalogStatusService>(TYPES.CatalogStatusService);

	const catalogStatus = await catalogService.search(page, availableOnly, term);

	res.send(JSON.stringify(catalogStatus));
});


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
}).then(connection => {

	app.listen(3000, () => {
		console.log(`Database connection is working: ${connection.isConnected}`);
	});
	// here you can start to work with your entities
}).catch(error => console.log(error));
