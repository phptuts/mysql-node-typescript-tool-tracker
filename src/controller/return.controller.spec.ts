import { plugins, Server } from "restify";
import { Container } from "inversify";
import { UserService } from "../service/entity/user.service";
import { JWTService } from "../service/jwt.service";
import { Connection } from "typeorm";
import { User } from "../entity/user";
import * as bodyParser from 'body-parser';
import path from "path";
import dotenv from "dotenv";
import { createConnectionTest, dropDatabase } from "../test/test-database-utils";
import { LoadTestFixtures } from "../test/load-test-fixtures";
import { createContainer } from "../container/container";
import { InversifyRestifyServer } from "inversify-restify-utils";
import { TYPES } from "../container/types";
import queryParser = plugins.queryParser;
import request from 'supertest';
import { ItemStatusService } from "../service/entity/item-status.service";

describe('return controller', () => {

	process.env.DB_CONNECTION_NAME = 'ReturnController';
	let app: Server | any;
	let container: Container;
	let userService: UserService;
	let jwtService: JWTService;
	let connection: Connection;
	let itemStatusService: ItemStatusService;

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
		itemStatusService = container.get(TYPES.ItemStatusService) as ItemStatusService;

		await loadFixtures.loadFiles( [
			path.join( __dirname, '..', 'fixture', 'test-return-controller', 'user.yml' ),
			path.join(__dirname, '..', 'fixture', 'test-return-controller', 'catalog.yml'),
			path.join(__dirname, '..', 'fixture', 'test-return-controller', 'item.yml'),
			path.join(__dirname, '..', 'fixture', 'test-return-controller', 'checkout-history.yml')
		], connection );

		user = await userService.findByEmail(  'return_tool_1@gmail.com' );

		console.log(user, 'user logged');
		jwtToken = (await jwtService.generateJWTToken(user)).token;

		console.log( 'should run before all tests' );
	} );

	afterAll( async () => {
		await connection.close();
		await dropDatabase( );
		console.log( 'should run after all tests' );

	} );


	it ('should not allow un auth traffic through', async (done) => {
		const response = await request( app )
			.patch( "/return-item/hammer_checked_out");

		expect(response.status).toBe(401);

		done();
	});

	it ('if item is already return should return a 400 with proper message', async (done) => {

		const response = await request( app )
			.patch( "/return-item/hammer_returned_rfid" )
			.set( "Authorization", `Bearer ${jwtToken}` )
			.send({ notes: 'nothing to report', damaged: false });

		expect(response.status).toBe(400);
		expect(response.body.data).toBe('Item has already been returned.');

		done();

	});

	it ('should allow a user to return an item', async (done) => {

		const itemStatusBeforeReturn = await itemStatusService.findByRfid('hammer_checked_out');

		expect(itemStatusBeforeReturn.isCheckedOut).toBeTruthy();

		const response = await request( app )
			.patch( "/return-item/hammer_checked_out" )
			.set( "Authorization", `Bearer ${jwtToken}` )
			.send({ notes: 'nothing to report', damaged: false });


		expect(response.status).toBe(204);

		const itemStatusAfterCheckout = await itemStatusService.findByRfid('hammer_checked_out');

		expect(itemStatusAfterCheckout.isCheckedOut).toBeFalsy();

		done();
	});

});
