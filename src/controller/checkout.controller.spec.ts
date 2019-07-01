import path from "path";
import dotenv from "dotenv";
import { createConnectionTest, dropDatabase } from "../test/test-database-utils";
import { LoadTestFixtures } from "../test/load-test-fixtures";
import { createContainer } from "../container/container";
import { InversifyRestifyServer } from "inversify-restify-utils";
import * as bodyParser from 'body-parser';
import { TYPES } from "../container/types";
import { UserService } from "../service/entity/user.service";
import { JWTService } from "../service/jwt.service";
import { plugins, Server } from "restify";
import { Container } from "inversify";
import { Connection } from "typeorm";
import { User } from "../entity/user";
import queryParser = plugins.queryParser;

describe('Checkout Controller', () => {

	const databaseName = 'CheckoutController';
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

	it ('test', () => expect(true).toBeTruthy());


});
