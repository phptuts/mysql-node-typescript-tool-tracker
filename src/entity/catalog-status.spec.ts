import 'jest';
import { CatalogStatus } from "./catalog-status";

describe('Catalog Status', () => {

	it ('should return if number of items available is greater than 0', () => {
		const catalogStatus = new CatalogStatus();

		catalogStatus.numberOfItemAvailable = 0;
		catalogStatus.afterLoad();
		expect(catalogStatus.canCheckout).toBeFalsy();

		catalogStatus.numberOfItemAvailable = 1;
		catalogStatus.afterLoad();
		expect(catalogStatus.canCheckout).toBeTruthy();
	});

});
