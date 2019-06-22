import { createConnection } from "typeorm";
import { User } from "../entity/user";
import { CheckoutHistory } from "../entity/checkout-history";
import { Item } from "../entity/item";
import { Catalog } from "../entity/catalog";
import { CatalogStatus } from "../entity/catalog-status";
import { ItemStatus } from "../entity/item-status";
import dotenv from "dotenv";
dotenv.config();

export const dbConnection =createConnection({
	type: "mysql",
	name: 'default',
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
	logging: false
});
