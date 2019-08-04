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
import request from 'supertest';

describe('Checkout Controller', () => {

	process.env.DB_CONNECTION_NAME = 'CheckoutController';
	let app: Server | any;
	let container: Container;
	let userService: UserService;
	let jwtService: JWTService;
	let connection: Connection;

	let user: User;
	let jwtToken;

	beforeAll( async () => {

		const testConfigPath = path.join( __dirname, '..', '..', '.env-test' );
		dotenv.config( { path: testConfigPath } );

		connection = await createConnectionTest(  );

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
			path.join( __dirname, '..', 'fixture', 'test-checkout-item', 'user.yml' ),
			path.join(__dirname, '..', 'fixture', 'test-checkout-item', 'catalog.yml'),
			path.join(__dirname, '..', 'fixture', 'test-checkout-item', 'item.yml'),
			path.join(__dirname, '..', 'fixture', 'test-checkout-item', 'checkout-history.yml')
		], connection );

		user = await userService.findByEmail(  'checkout_user_1@gmail.com' );

		console.log(user, 'user logged');
		jwtToken = (await jwtService.generateJWTToken(user)).token;

		console.log( 'should run before all tests' );
	} );

	afterAll( async () => {
		await connection.close();
		await dropDatabase(  );
		console.log( 'should run after all tests' );

	} );

	it ('if an items is checked out it should block checkout', async (done) => {

		const response = await request( app )
			.patch( "/checkout/rfid_already_checkout_out_hammer" )
			.set( "Authorization", `Bearer ${jwtToken}` );


		expect(response.status).toBe(400);
		expect(response.body.data).toBe('Item is already checked out.');
		done();
	});


	it ('if item is not checked out it should let you check out the item', async (done) => {
		const response = await request( app )
			.patch( "/checkout/checkout_hammer" )
			.set( "Authorization", `Bearer ${jwtToken}` );

		expect(response.status).toBe(204);
		done();
	});

	it ('if the user is not authenticated it should return a 401', async (done) => {

		const response = await request( app )
			.patch( "/checkout/checkout_hammer" );

		expect(response.status).toBe(401);
		done();
	});
});
