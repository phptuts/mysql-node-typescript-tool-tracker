import { createConnection } from "typeorm";
import { User } from "../entity/user";
import { CheckoutHistory } from "../entity/checkout-history";
import { Item } from "../entity/item";
import { Catalog } from "../entity/catalog";
import { ItemStatus } from "../entity/item-status";
import { CatalogStatus } from "../entity/catalog-status";


export const createTestConnection = async () => {
	return  await createConnection({
		dropSchema: true,
		name: "default",
		type: "mysql",
		host: "localhost",
		port: 3306,
		username: "root",
		password: "",
		database: "tool-tracker-test",
		bigNumberStrings: false, // Prevent orm from serializing number to string
		entities: [

			User,
			CheckoutHistory,
			Item,
			Catalog,

			ItemStatus,
			CatalogStatus
		],
		synchronize: true,
		logging: true
	});
};

