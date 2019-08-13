import { plugins, Server } from "restify";
import { Container } from "inversify";
import { UserService } from "../service/entity/user.service";
import { JWTService } from "../service/jwt.service";
import { Connection } from "typeorm";
import path from "path";
import dotenv from "dotenv";
import { createConnectionTest, dropDatabase } from "../test/test-database-utils";
import { LoadTestFixtures } from "../test/load-test-fixtures";
import { createContainer } from "../container/container";
import { InversifyRestifyServer } from "inversify-restify-utils";
import * as bodyParser from 'body-parser';
import { TYPES } from "../container/types";
import { RegisterRequest } from "../model/request/register.request";
import { ROLES } from "../entity/user";
import queryParser = plugins.queryParser;
import request from 'supertest';

describe('register controller', () => {

	process.env.DB_CONNECTION_NAME = 'RegisterController';
	let app: Server | any;
	let container: Container;
	let userService: UserService;
	let jwtService: JWTService;
	let jwtToken;
	let connection: Connection;


	beforeAll(async () => {
		const testConfigPath = path.join( __dirname, '..', '..', '.env-test' );
		dotenv.config( { path: testConfigPath } );

		connection = await createConnectionTest(  );

		const loadFixtures = new LoadTestFixtures();

		container = createContainer( );

		const server = new InversifyRestifyServer( container );
		app = server.setConfig( app => {
			app.use( bodyParser.urlencoded( {
				extended: true
			} ) );
			app.use( bodyParser.json() );
			app.use( queryParser() );
		} ).build();

		await loadFixtures.loadFiles([
			path.join( __dirname, '..', 'fixture', 'test-register-controller', 'admin.yml' )
		], connection);

		userService = container.get( TYPES.UserService ) as UserService;
		jwtService = container.get( TYPES.JWTService ) as JWTService;

		jwtToken = (await jwtService.generateJWTToken(await userService.findByRfid('rfid_admin'))).token;

	});

	afterAll( async () => {
		await connection.close();
		await dropDatabase( );
	} );

	it ('admin should be able to register a user', async (done) => {

		const registerRequest : RegisterRequest = {
			rfid: 'new_rfid',
			email: 'glaserpower+33@gmail.com',
			phone: '555-555-5555',
			roles: [ROLES.ROLE_ADMIN, ROLES.ROLE_USER],
		};

		const response = await request( app )
			.post( "/user" )
			.set( "Authorization", `Bearer ${jwtToken}` )
			.send(registerRequest);

		console.log(response.body, 'response body');
		const { meta, data } = response.body;
		expect(meta.type).toBe('register_user');

		expect(data.rfid).toBe('new_rfid');
		expect(data.email).toBe('glaserpower+33@gmail.com');
		expect(data.phone).toBe('555-555-5555');
		expect(data.roles).toEqual([ROLES.ROLE_ADMIN, ROLES.ROLE_USER]);

		expect(response.status).toBe(201);
		console.log('1');

		done();
	});

	it ('Only role admin should be able to register a user', async (done) => {
		const jwtToken = (await jwtService.generateJWTToken(await userService.findByRfid('rfid_admin_2'))).token;

		const registerRequest : RegisterRequest = {
			rfid: 'new_rfid2',
			email: 'glaserpower+332@gmail.com',
			phone: '555-555-5555',
			roles: [ROLES.ROLE_ADMIN, ROLES.ROLE_USER],
		};

		const response = await request( app )
			.post( "/user" )
			.set( "Authorization", `Bearer ${jwtToken}` )
			.send(registerRequest);

		expect(response.status).toBe(403);
		done();
	});

	it ('should not allow duplicate rfid to be register', async (done) => {

		const registerRequest : RegisterRequest = {
			rfid: 'rfid_admin',
			email: 'glaserpower+3321@gmail.com',
			phone: '555-555-5555',
			roles: [ROLES.ROLE_ADMIN, ROLES.ROLE_USER],
		};

		const response = await request( app )
			.post( "/user" )
			.set( "Authorization", `Bearer ${jwtToken}` )
			.send(registerRequest);

		expect(response.status).toBe(400);
		const { meta, data } = response.body;

		expect(meta.type).toBe('form_errors');
		expect(data[0].property).toBe('rfid');
		done();

	});

	it ('should not allow duplicate emails to be registered', async (done) => {
		const registerRequest : RegisterRequest = {
			rfid: 'rfid_123423',
			email: 'register_user_2@gmail.com',
			phone: '555-555-5555',
			roles: [ROLES.ROLE_ADMIN, ROLES.ROLE_USER],
		};

		const response = await request( app )
			.post( "/user" )
			.set( "Authorization", `Bearer ${jwtToken}` )
			.send(registerRequest);

		expect(response.status).toBe(400);
		const { meta, data } = response.body;

		expect(meta.type).toBe('form_errors');
		expect(data[0].property).toBe('email');
		done();
	});

	it ('should not allow not ROLES to be registered', async (done) => {
		const registerRequest : RegisterRequest = {
			rfid: 'rfid_324432423423',
			email: 'glaserpower+3321dsdf3@gmail.com',
			phone: '555-555-5555',
			roles: ['adsfasdf' as any],
		};

		const response = await request( app )
			.post( "/user" )
			.set( "Authorization", `Bearer ${jwtToken}` )
			.send(registerRequest);

		expect(response.status).toBe(400);
		const { meta, data } = response.body;

		expect(meta.type).toBe('form_errors');
		expect(data[0].property).toBe('roles');
		done();
	});

	it ('only valid email address should be registered', async (done) => {
		const registerRequest : RegisterRequest = {
			rfid: 'rfid_3244324asdfasdf',
			email: 'glaserpower+3321dsdf',
			phone: '555-555-5555',
			roles: ['adsfasdf' as any],
		};

		const response = await request( app )
			.post( "/user" )
			.set( "Authorization", `Bearer ${jwtToken}` )
			.send(registerRequest);

		expect(response.status).toBe(400);
		const { meta, data } = response.body;

		expect(meta.type).toBe('form_errors');
		expect(data[0].property).toBe('email');
		done();

	});
});
