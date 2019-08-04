import 'jest';
import { createConnectionTest, dropDatabase } from "../test/test-database-utils";
import { createContainer, getContainer } from "./container";
import { TYPES } from "./types";
import { CatalogStatusService } from "../service/entity/catalog-status.service";
import { JWTService } from "../service/jwt.service";
import { PaginateService } from "../service/paginate.service";
import { ItemStatusService } from "../service/entity/item-status.service";
import { UserService } from "../service/entity/user.service";
import { EntityService } from "../service/entity/entity.service";

describe('container', () => {
	process.env.DB_CONNECTION_NAME = 'default';
	let connection;


	beforeAll(async () => {
		connection = await createConnectionTest( );
	});

	afterAll(async () => {
		await connection.close();
		await dropDatabase();
	});

	it ('should be able to use the getContainer function without creating a starting container and fetch all dependencies', () => {
			const container = getContainer();
			expect(container.get(TYPES.CatalogStatusService)).toBeInstanceOf(CatalogStatusService);

		expect(container.get(TYPES.JWTService)).toBeInstanceOf(JWTService);
		expect(container.get(TYPES.PaginatedService)).toBeInstanceOf(PaginateService);
		expect(container.get(TYPES.ItemStatusService)).toBeInstanceOf(ItemStatusService);
		expect(container.get(TYPES.UserService)).toBeInstanceOf(UserService);
		expect(container.get(TYPES.CheckoutHistoryService)).toBeInstanceOf(EntityService);


		console.log('everything complete');
	});

});
