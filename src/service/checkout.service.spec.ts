import 'jest';
import { CheckoutService } from "./checkout.service";
import { CheckoutHistory } from "../entity/checkout-history";
import { User } from "../entity/user";
import { Item } from "../entity/item";
import { EntityService } from "./entity/entity.service";


describe('Checkout Service', () => {

	let service: CheckoutService;

	let checkoutHistoryService: EntityService<CheckoutHistory>|any;

	let checkoutHistoryServiceSaveSpy: jest.SpyInstance;

	beforeEach(async () => {
		checkoutHistoryService = {
			save(checkoutHistory: CheckoutHistory): Promise<CheckoutHistory> {
				return Promise.resolve(undefined);
			}
		};

		checkoutHistoryServiceSaveSpy = jest.spyOn(checkoutHistoryService, 'save');

		service = new CheckoutService(checkoutHistoryService);
	});

	it ('should create a new checkout entry in the database and save', async () =>{
		checkoutHistoryServiceSaveSpy.mockImplementation(checkoutHistory =>
			Promise.resolve(checkoutHistory));

		const user = new User();
		const item = new Item();
		const checkoutHistory = await service.checkoutItem(user, item);

		expect(checkoutHistoryServiceSaveSpy).toHaveBeenCalledWith(expect.any(CheckoutHistory));
		expect(checkoutHistory.item).toBe(item);
		expect(checkoutHistory.userCheckoutItem).toBe(user);
	});
});
