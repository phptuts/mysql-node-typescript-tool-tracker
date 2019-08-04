import { createConnectionTest, dropDatabase } from "../test/test-database-utils";
import { LoadTestFixtures } from "../test/load-test-fixtures";
import path from "path";
import { createContainer } from "../container/container";
import { TYPES } from "../container/types";
import { JWTService } from "../service/jwt.service";
import { Connection } from "typeorm";

import { InversifyRestifyServer } from "inversify-restify-utils";
import * as bodyParser from 'body-parser';

import { plugins, Server } from "restify";
import queryParser = plugins.queryParser;
import request from 'supertest';
import { Container } from "inversify";
import dotenv from "dotenv";
import { UserService } from "../service/entity/user.service";

describe( 'catalog controller', () => {

	process.env.DB_CONNECTION_NAME = 'CatalogController';
	let app: Server | any;
	let container: Container;
	let userService: UserService;
	let jwtService: JWTService;
	let jwtToken;
	let connection: Connection;

	beforeAll( async () => {

		const testConfigPath = path.join( __dirname, '..', '..', '.env-test' );
		dotenv.config( { path: testConfigPath } );

		connection = await createConnectionTest();

		const loadFixtures = new LoadTestFixtures();

		container = createContainer(  );

		const server = new InversifyRestifyServer( container );
		app = server.setConfig( app => {
			app.use( bodyParser.urlencoded( {
				extended: true
			} ) );
			app.use( bodyParser.json() );
			app.use( queryParser() );
		} ).build();

		userService = container.get( TYPES.UserService ) as UserService;
		jwtService = container.get( TYPES.JWTService ) as JWTService;

		await loadFixtures.loadFiles( [
			path.join( __dirname, '..', 'fixture', 'test-item-status-service', 'user.yml' ),
			path.join( __dirname, '..', 'fixture', 'test-item-status-service', 'catalog.yml' ),
			path.join( __dirname, '..', 'fixture', 'test-item-status-service', 'item.yml' ),
			path.join( __dirname, '..', 'fixture', 'test-item-status-service', 'checkout-history.yml' )
		], connection );

		const user = await userService.findByEmail(  'test-tool-checkout-service_1@gmail.com' );
		jwtToken = (await jwtService.generateJWTToken( user )).token;
	} );

	afterAll( async () => {
		await connection.close();
		await dropDatabase( );
	} );

	describe('basic pagination', () => {

		it( 'should be able to go to page 1 ', async ( done ) => {

			const page1 = {
				"data": [
					{
						"catalogId": expect.any( String ),
						"name": "Hammer",
						"description": "Hammer",
						"numberOfItems": 3,
						"numberOfItemCheckedOut": 3,
						"numberOfItemsDamaged": 0,
						"numberOfItemAvailable": 0,
						"canCheckout": false
					}
				],
				"meta": {
					"pageSize": 1,
					"currentPage": 1,
					"lastPage": false,
					"type": "CATALOG_STATUS",
					"numberOfPages": 3
				}
			};

			const response = await request( app )
				.get( "/catalog-search?page=1" )
				.set( "Authorization", `Bearer ${jwtToken}` );

			expect(response.status).toBe(200);
			expect(response.body).toEqual( page1 );

			done();
		} );

		it( 'should be able to go to page 2', async ( done ) => {

			const page2 = {
				data: [
					{
						"catalogId": expect.any( String ),
						"name": "Nail Gun",
						"description": "Nail Gun",
						"numberOfItems": 3,
						"numberOfItemCheckedOut": 0,
						"numberOfItemsDamaged": 1,
						"numberOfItemAvailable": 2,
						"canCheckout": true
					}
				],
				"meta": {
					"pageSize": 1,
					"currentPage": 2,
					"lastPage": false,
					"type": "CATALOG_STATUS",
					"numberOfPages": 3
				}
			};


			const response = await request( app )
				.get( "/catalog-search?page=2" )
				.set( "Authorization", `Bearer ${jwtToken}` );

			expect(response.status).toBe(200);
			expect(response.body).toEqual( page2 );

			done();
		} );

		it( 'should be able to go to page 3', async ( done ) => {

			const page3 = {
				data: [
					{
						"catalogId": expect.any( String ),
						"name": "Screw Driver",
						"description": "Screw Driver",
						"numberOfItems": 3,
						"numberOfItemCheckedOut": 0,
						"numberOfItemsDamaged": 0,
						"numberOfItemAvailable": 3,
						"canCheckout": true
					}
				],
				"meta": {
					"pageSize": 1,
					"currentPage": 3,
					"lastPage": true,
					"type": "CATALOG_STATUS",
					"numberOfPages": 3
				}
			};

			const response = await request( app )
				.get( "/catalog-search?page=3" )
				.set( "Authorization", `Bearer ${jwtToken}` );

			expect(response.status).toBe(200);
			expect(response.body).toEqual( page3 );

			done();
		} );
	});

	describe('pagination with available only', () => {

		it( 'should be able to go to page 1', async ( done ) => {

			const page2 = {
				data: [
					{
						"catalogId": expect.any( String ),
						"name": "Nail Gun",
						"description": "Nail Gun",
						"numberOfItems": 3,
						"numberOfItemCheckedOut": 0,
						"numberOfItemsDamaged": 1,
						"numberOfItemAvailable": 2,
						"canCheckout": true
					}
				],
				"meta": {
					"pageSize": 1,
					"currentPage": 1,
					"lastPage": false,
					"type": "CATALOG_STATUS",
					"numberOfPages": 2
				}
			};


			const response = await request( app )
				.get( "/catalog-search?page=1&availableOnly=1" )
				.set( "Authorization", `Bearer ${jwtToken}` );

			expect(response.status).toBe(200);
			expect( response.body ).toEqual( page2 );

			done();
		} );

		it( 'should be able to go to page 2', async ( done ) => {

			const page3 = {
				data: [
					{
						"catalogId": expect.any( String ),
						"name": "Screw Driver",
						"description": "Screw Driver",
						"numberOfItems": 3,
						"numberOfItemCheckedOut": 0,
						"numberOfItemsDamaged": 0,
						"numberOfItemAvailable": 3,
						"canCheckout": true
					}
				],
				"meta": {
					"pageSize": 1,
					"currentPage": 2,
					"lastPage": true,
					"type": "CATALOG_STATUS",
					"numberOfPages": 2
				}
			};

			const response = await request( app )
				.get( "/catalog-search?page=2&availableOnly=1" )
				.set( "Authorization", `Bearer ${jwtToken}` );


			expect(response.status).toBe(200);
			expect( response.body ).toEqual( page3 );

			done();
		} );
	});

	describe('Basic Search test', () => {
		it( 'Search Hammer', async ( done ) => {

			const hammerPage = {
				"data": [
					{
						"catalogId": expect.any( String ),
						"name": "Hammer",
						"description": "Hammer",
						"numberOfItems": 3,
						"numberOfItemCheckedOut": 3,
						"numberOfItemsDamaged": 0,
						"numberOfItemAvailable": 0,
						"canCheckout": false
					}
				],
				"meta": {
					"pageSize": 1,
					"currentPage": 1,
					"lastPage": true,
					"type": "CATALOG_STATUS",
					"numberOfPages": 1
				}
			};

			const response = await request( app )
				.get( "/catalog-search?term=Hammer" )
				.set( "Authorization", `Bearer ${jwtToken}` );

			expect(response.status).toBe(200);
			expect( response.body ).toEqual( hammerPage );

			done();
		} );
	});
} );


