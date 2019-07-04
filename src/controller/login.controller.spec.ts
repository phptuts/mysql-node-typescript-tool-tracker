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
import { User } from "../entity/user";

describe( 'login controller', () => {

	const databaseName = 'LoginController';
	let app: Server | any;
	let container: Container;
	let userService: UserService;
	let jwtService: JWTService;
	let connection: Connection;

	let disabledUser: User;

	let enabledUser: User;

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

		userService = container.get( TYPES.UserService ) as UserService;
		jwtService = container.get( TYPES.JWTService ) as JWTService;

		await loadFixtures.loadFiles( [
			path.join( __dirname, '..', 'fixture', 'test-user-login', 'user.yml' ),
		], connection );

		enabledUser = await userService.findByEmail( 'test-user-login_1@gmail.com' );
		disabledUser = await userService.findByEmail( 'test-user-login_2@gmail.com' );
		console.log( 'should run before all tests' );
	} );

	afterAll( async () => {
		await connection.close();
		await dropDatabase( databaseName );
		console.log( 'should run after all tests' );

	} );


	it( 'Should return a 401 if no rfid is sent ', async ( done ) => {

		const response = await request( app )
			.post( "/login" );

		expect(response.status).toBe(403);

		done();
	} );

	it( 'Should return a 403 for invalid rfid ', async ( done ) => {

		const response = await request( app )
			.post( "/login" )
			.send( { 'rfid': 'crap_rfid' } );

		expect( response.status ).toBe( 403 );

		done();
	} );

	it( 'Should return a 403 for disabled user ', async ( done ) => {

		const response = await request( app )
			.post( "/login" )
			.send( { 'rfid': disabledUser.rfid } );

		expect( response.status ).toBe( 403 )

		done();
	} );

	it( 'should return a jwt token for enabled user', async ( done ) => {
		const response = await request( app )
			.post( "/login" )
			.send( { 'rfid': enabledUser.rfid } );

		expect(response.status).toBe(201);
		// testing timestamp is greater than 2 hours
		expect( response.body.data.exp ).toBeGreaterThan(
			Math.floor( Date.now() / 1000 ) + 9 * 60
		);

		const user = await jwtService.verifyJWTToken( response.body.data.token ) as User;
		expect( user.email ).toBe( enabledUser.email );

		done();
	} );

	it ('should return a 403 if not user is found with the rfid', async (done) => {
		const response = await request( app )
			.post( "/login" )
			.send( { 'rfid': 'craprfid' } );

		expect(response.status).toBe(403);

		done();
	});

} );


