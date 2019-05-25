import 'jest';
import { LoadTestFixtures } from "../test/load-test-fixtures";
import path from 'path';
import { ItemStatusRepository } from "./item-status.repository";
import { User } from "../entity/user";
import { getConnection, getCustomRepository, getRepository } from "typeorm";
import { createTestConnection } from "../test/create-test-connection";

describe('ItemStatusService', () => {

	let repository: ItemStatusRepository;

	let user1: User;

	let user2: User;

	let user3: User;

	beforeAll(async () => {
		const connection = await createTestConnection();
		const userRepository =  getRepository(User);
		console.log(connection.isConnected);

		repository = getCustomRepository(ItemStatusRepository);
		const loadFixtures = new LoadTestFixtures();

		await loadFixtures.loadFiles([
			path.join(__dirname,'..','fixture', 'test-item-status-service', 'user.yml'),
			path.join(__dirname,'..','fixture', 'test-item-status-service', 'catalog.yml'),
			path.join(__dirname,'..','fixture', 'test-item-status-service', 'item.yml'),
			path.join(__dirname,'..','fixture', 'test-item-status-service', 'checkout-history.yml')
		]);

		user1 = await userRepository
			.findOne({email: 'test-tool-checkout-service_1@gmail.com'});

		console.log(user1.roles, 'roles');

		user2 = await userRepository
			.findOne({email: 'test-tool-checkout-service_2@gmail.com'});

		user3 = await userRepository
			.findOne({email: 'test-tool-checkout-service_3@gmail.com'});

	});

	afterAll(async () => {
		const connection = await getConnection('default');
		connection.close();
	});



	it ('should return the items the user has checked out', async () => {
		expect((await repository.itemsUserCurrentlyHasCheckout(user3.id)).length).toBe(2);
		expect((await repository.itemsUserCurrentlyHasCheckout(user2.id)).length).toBe(1);
		expect((await repository.itemsUserCurrentlyHasCheckout(user1.id)).length).toBe(0);
	});

});
