import 'jest';
import { CatalogStatus } from "../entity/catalog-status";
import { CatalogStatusRepository } from "../repository/catalog-status.repository";
import { CatalogStatusService } from "./catalog-status.service";
import { PaginateService } from "./paginate.service";

describe('Catalog Status Service', () => {

	const repository: CatalogStatusRepository|any = {
		search( page: number, pageSize: number, availableOnly: boolean = false, term: string = '' ): Promise<{ data: CatalogStatus[]; total: number }> {
			return Promise.resolve({ data: [], total: 0 });
		}
	};

	let service: CatalogStatusService;

	let repositorySpy: jest.SpyInstance;

	beforeEach(async () => {

		service = new CatalogStatusService(new PaginateService(), repository);
		repositorySpy = jest.spyOn(repository, 'search');
	});


	it ('should use the repository to get a paginated response', async () => {
		const cat1 = new CatalogStatus();
		cat1.catalogId = 'Hammer';
		cat1.numberOfItemsDamaged = 0;
		cat1.numberOfItems = 3;
		cat1.numberOfItemAvailable = 3;
		cat1.numberOfItemCheckedOut = 0;
		cat1.description = 'lab';
		cat1.name = 'lab';
		cat1.canCheckout = true;

		repositorySpy.mockImplementation(() => {
			return {
				data: [cat1],
				total: 1
			}
		});

		const service = new CatalogStatusService(new PaginateService(), repository);
		const response = await service.search(1, true, 'Hammer');
		console.log(response);
		expect(repositorySpy).toHaveBeenCalledWith(1,
			parseInt(process.env.PAGE_SIZE), true, 'Hammer');
	});

});
