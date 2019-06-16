import 'jest';
import { LoadTestFixtures } from "../../test/load-test-fixtures";
import path from 'path';
import { User } from "../../entity/user";
import { Connection, getRepository } from "typeorm";
import { createConnectionTest, dropDatabase } from "../../test/test-database-utils";
import { ItemStatus } from "../../entity/item-status";
import { ItemStatusService } from "./item-status.service";

describe('ItemStatusRepository', () => {

	const databaseName = 'ItemStatusRepository';


	let service: ItemStatusService;

	let user1: User;

	let user2: User;

	let user3: User;

	let connection: Connection;

	beforeAll(async () => {

		console.log('ItemStatusService');
		connection = await createConnectionTest(databaseName);
		const userRepository =  getRepository(User, databaseName);

		service = new ItemStatusService(getRepository(ItemStatus, databaseName));
		const loadFixtures = new LoadTestFixtures();

		await loadFixtures.loadFiles([
			path.join(__dirname,'..','fixture', 'test-item-status-service', 'user.yml'),
			path.join(__dirname,'..','fixture', 'test-item-status-service', 'catalog.yml'),
			path.join(__dirname,'..','fixture', 'test-item-status-service', 'item.yml'),
			path.join(__dirname,'..','fixture', 'test-item-status-service', 'checkout-history.yml')
		], connection);

		user1 = await userRepository
			.findOne({email: 'test-tool-checkout-service_1@gmail.com'});

		console.log(user1.roles, 'roles');

		user2 = await userRepository
			.findOne({email: 'test-tool-checkout-service_2@gmail.com'});

		user3 = await userRepository
			.findOne({email: 'test-tool-checkout-service_3@gmail.com'});

	});

	afterAll(async () => {
		await connection.close();
		await dropDatabase( databaseName );
	});

	it ('should return the items the user has checked out', async () => {
		expect((await service.itemsUserCurrentlyHasCheckout(user3.id)).length).toBe(2);
		expect((await service.itemsUserCurrentlyHasCheckout(user2.id)).length).toBe(1);
		expect((await service.itemsUserCurrentlyHasCheckout(user1.id)).length).toBe(0);
		expect(true).toBeTruthy();
	});

});
