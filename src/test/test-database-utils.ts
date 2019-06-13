import {  createConnection } from "typeorm";
import { User } from "../entity/user";
import { CheckoutHistory } from "../entity/checkout-history";
import { Item } from "../entity/item";
import { Catalog } from "../entity/catalog";
import { ItemStatus } from "../entity/item-status";
import { CatalogStatus } from "../entity/catalog-status";
import mysql from 'mysql';


export const createConnectionTest = async ( dbName: string ) => {

	try {
		await dropDatabase(dbName);
		await createDatabase(dbName);
	} catch (e) {
		console.log( e, 'error' );
	}

	try {

		const connection = await createConnection( {
			name: dbName,
			type: "mysql",
			host: "localhost",
			port: 3306,
			username: "root",
			password: "",
			database: dbName,
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

export const dropDatabase = async ( dbName: string ) => {
	await runNativeQuery(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
};


const createDatabase = async (dbName: string) => {
	await runNativeQuery(`CREATE DATABASE \`${dbName}\`;`);
};

const runNativeQuery = async (queryString: string) => {
	const nativeConnection = mysql.createConnection( {
		host: 'localhost',
		user: 'root',
		password: '',
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
