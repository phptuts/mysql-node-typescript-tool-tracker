import { createConnectionTest, dropDatabase } from "../test/test-database-utils";
import { LoadTestFixtures } from "../test/load-test-fixtures";
import path from "path";
import { createContainer } from "../container/container";
import { TYPES } from "../container/types";
import { JWTService } from "../service/jwt.service";
import { Connection, Repository } from "typeorm";
import { User } from "../entity/user";

import { InversifyRestifyServer } from "inversify-restify-utils";
import * as bodyParser from 'body-parser';

import { plugins, Server } from "restify";
import queryParser = plugins.queryParser;
import request from 'supertest';
import { Container } from "inversify";
import dotenv from "dotenv";

describe( 'catalog controller', () => {

	const databaseName = 'CatalogController';
	let app: Server | any;
	let container: Container;
	let userRepository: Repository<User>;
	let jwtService: JWTService;
	let jwtToken;
	let connection: Connection;

	beforeAll( async () => {

		const testConfigPath = path.join( __dirname, '..', '..', '.env-test' );
		dotenv.config( { path: testConfigPath } );

		connection = await createConnectionTest( databaseName );

		const loadFixtures = new LoadTestFixtures();

		container = createContainer( databaseName );

		const server = new InversifyRestifyServer( container );
		app = server.setConfig( app => {
			app.use( bodyParser.urlencoded( {
				extended: true
			} ) );
			app.use( bodyParser.json() );
			app.use( queryParser() );
		} ).build();

		userRepository = container.get( TYPES.UserRepository ) as Repository<User>;
		jwtService = container.get( TYPES.JWTService ) as JWTService;

		await loadFixtures.loadFiles( [
			path.join( __dirname, '..', 'fixture', 'test-item-status-service', 'user.yml' ),
			path.join( __dirname, '..', 'fixture', 'test-item-status-service', 'catalog.yml' ),
			path.join( __dirname, '..', 'fixture', 'test-item-status-service', 'item.yml' ),
			path.join( __dirname, '..', 'fixture', 'test-item-status-service', 'checkout-history.yml' )
		], connection );

		const user = await userRepository.findOne( { email: 'test-tool-checkout-service_1@gmail.com' } );
			console.log(user, 'user was reached');
		jwtToken = await jwtService.generateJWTToken( user );
		//
		console.log( jwtToken, 'jwt token' );
	} );

	afterAll( async () => {
		await connection.close();
		await dropDatabase( databaseName );
	} );


	it( 'should be able to go to page 1 ',  ( done ) => {

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

		request( app )
			.get( "/catalog-search?page=1" )
			.set( "Authorization", `Bearer ${jwtToken}` )
			.expect( 200 )
			.expect( function ( res: any ) {
				expect( res.body ).toEqual( page1 );
			} )
			.end( function ( err, res ) {
				if (err) {
					throw err;
				}
				done();
			} );


	} );

	it( 'should be able to go to page 2',  ( done ) => {


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


		request( app )
			.get( "/catalog-search?page=2" )
			.set( "Authorization", `Bearer ${jwtToken}` )
			.expect( 200 )
			.expect( function ( res: any ) {
				expect( res.body ).toEqual( page2 );
			} )
			.end( function ( err, res ) {
				if (err) {
					throw err;
				}
				done();
			} );


	} );

	it( 'should be able to go to page 3',  ( done ) => {

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

		request( app )
			.get( "/catalog-search?page=3" )
			.set( "Authorization", `Bearer ${jwtToken}` )
			.expect( 200 )
			.expect( function ( res: any ) {
				expect( res.body ).toEqual( page3 );
			} )
			.end( function ( err, res ) {
				if (err) {
					throw err;
				}
				done();
			} );
	} );
} );
