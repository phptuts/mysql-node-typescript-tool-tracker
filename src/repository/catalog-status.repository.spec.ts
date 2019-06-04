import 'jest';
import { createTestConnection } from "../test/create-test-connection";
import { getConnection, getCustomRepository, getRepository } from "typeorm";
import { LoadTestFixtures } from "../test/load-test-fixtures";
import path from "path";
import { CatalogStatusRepository } from "./catalog-status.repository";

describe('catalog status repository', () => {

	let repository: CatalogStatusRepository;

	beforeAll(async () => {
		const connection = await createTestConnection();
		console.log(connection.isConnected);

		const loadFixtures = new LoadTestFixtures();

		await loadFixtures.loadFiles([
			path.join(__dirname,'..','fixture', 'test-item-status-service', 'user.yml'),
			path.join(__dirname,'..','fixture', 'test-item-status-service', 'catalog.yml'),
			path.join(__dirname,'..','fixture', 'test-item-status-service', 'item.yml'),
			path.join(__dirname,'..','fixture', 'test-item-status-service', 'checkout-history.yml')
		]);
	});

	beforeEach(async () => {

		repository = getCustomRepository(CatalogStatusRepository);


	});

	afterAll(async () => {
		const connection = await getConnection('default');
		connection.close();
	});

	it ('should be able to search with pagination', async () => {

		const page1Data = await repository.search(1, 1);

		expect(page1Data.total).toBe(3);
		expect(page1Data.data.length).toBe(1);


		const page2Data = await repository.search(2, 1);
		expect(page2Data.data[0].catalogId).not.toBe(page1Data.data[0].catalogId);
		expect(page2Data.data.length).toBe(1);

		const page3Data = await repository.search(3, 1);

		expect(page3Data.data[0].catalogId).not.toBe(page2Data.data[0].catalogId);
		expect(page3Data.data.length).toBe(1);

		const page4Data = await repository.search(4, 1);

		expect(page4Data.data.length).toBe(0);
		expect(page4Data.total).toBe(3);

	});

	it ('should be able to search for an item', async() => {
		const page1Data = await repository.search(1, 10, false, 'Hammer');

		expect(page1Data.total).toBe(1);

	});

	it ('should be able to filter out items not available', async () => {
		const page1Data = await repository.search(1, 10, true);
		console.log(page1Data);
		expect(page1Data.total).toBe(2);
	});

});
