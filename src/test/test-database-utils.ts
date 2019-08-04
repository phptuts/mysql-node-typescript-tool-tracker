import {  createConnection } from "typeorm";
import { User } from "../entity/user";
import { CheckoutHistory } from "../entity/checkout-history";
import { Item } from "../entity/item";
import { Catalog } from "../entity/catalog";
import { ItemStatus } from "../entity/item-status";
import { CatalogStatus } from "../entity/catalog-status";
import mysql from 'mysql';


export const createConnectionTest = async (  ) => {

	try {
		await dropDatabase();
		await createDatabase(process.env.DB_CONNECTION_NAME);
	} catch (e) {
		console.log( e, 'error' );
	}

	try {

		const connection = await createConnection( {
			name: process.env.DB_CONNECTION_NAME,
			type: "mysql",
			host: process.env['DB_HOST'],
			port: 3306,
			username: process.env['DB_USER'],
			password: process.env['DB_PASSWORD'],
			database: process.env.DB_CONNECTION_NAME,
			bigNumberStrings: false, // Prevent orm from serializing number to string
			entities: [

				User,
				CheckoutHistory,
				Item,
				Catalog,

				ItemStatus,
				CatalogStatus
			],
			logging: false,
			synchronize: true
		} );

		console.log( 'test db setup' );
		return connection;


	} catch (e) {
		console.log( e.message, 'connection and sync failed');
	}


};

export const dropDatabase = async (  ) => {
	await runNativeQuery(`DROP DATABASE IF EXISTS \`${process.env.DB_CONNECTION_NAME}\`;`);
};


const createDatabase = async (dbName: string) => {
	await runNativeQuery(`CREATE DATABASE \`${dbName}\`;`);
};

const runNativeQuery = async (queryString: string) => {
	const nativeConnection = mysql.createConnection( {
		host: process.env['DB_HOST'],
		port: 3306,
		user: process.env['DB_USER'],
		password: process.env['DB_PASSWORD'],
	} );
	await new Promise( ( res, rej ) => {
		nativeConnection.query( queryString, ( error, result ) => {
			console.log('result of query ran', queryString, result );
			if (error) {
				console.log( error.message );
				rej( error.message );
			}

			nativeConnection.destroy();
			res(undefined);
			return;
		} )
	} );
};
