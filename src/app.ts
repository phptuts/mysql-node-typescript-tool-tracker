import "reflect-metadata";
import {createConnection} from "typeorm";
import { User } from "./entity/user";
import { CheckoutHistory } from "./entity/checkout-history";
import { Item } from "./entity/item";
import { Catalog } from "./entity/catalog";
import dotenv  from 'dotenv';
dotenv.config();


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
		Catalog
	],
	synchronize: true,
	logging: false
}).then(connection => {
	// here you can start to work with your entities
}).catch(error => console.log(error));
