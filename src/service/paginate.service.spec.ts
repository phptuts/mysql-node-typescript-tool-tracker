import 'jest';
import { PaginateService } from "./paginate.service";
import { Item } from "../entity/item";

describe('Paginate Service', () => {

	const service = new PaginateService();

	it ('general test of remainders and last page', () => {
		const itemPage2 = service.createResponse<Item>([new Item(), new Item(), new Item()], 13, 2, 3, 'Item');

		expect(itemPage2.meta.numberOfPages).toBe(5);
		expect(itemPage2.meta.lastPage).toBeFalsy();
		expect(itemPage2.meta.currentPage).toBe(2);
		expect(itemPage2.meta.pageSize).toBe(3);

		const itemPage5 = service.createResponse<Item>([new Item()], 13, 5, 3, 'Item');

		expect(itemPage5.meta.numberOfPages).toBe(5);
		expect(itemPage5.meta.lastPage).toBeTruthy();
		expect(itemPage5.meta.currentPage).toBe(5);
		expect(itemPage5.meta.pageSize).toBe(3);

	});
});
