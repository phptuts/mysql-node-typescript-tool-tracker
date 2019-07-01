import 'jest';
import { CheckoutService } from "./checkout.service";
import { CheckoutHistory } from "../entity/checkout-history";
import { User } from "../entity/user";
import { Item } from "../entity/item";
import { EntityService } from "./entity/entity.service";
import { ItemStatusService } from "./entity/item-status.service";
import { ItemStatus } from "../entity/item-status";


describe('Checkout Service', () => {

	let service: CheckoutService;

	let checkoutHistoryService: EntityService<CheckoutHistory>|any;

	let checkoutHistoryServiceSaveSpy: jest.SpyInstance;

	let itemStatusService: ItemStatusService|any;

	let itemStatusServiceFindByID: jest.SpyInstance;

	beforeEach(async () => {
		checkoutHistoryService = {
			save(checkoutHistory: CheckoutHistory): Promise<CheckoutHistory> {
				return Promise.resolve(undefined);
			}
		};

		itemStatusService = {
			findById( id: string ): Promise<ItemStatus> {
				return Promise.resolve(new ItemStatus());
			}
		}

		checkoutHistoryServiceSaveSpy = jest.spyOn(checkoutHistoryService, 'save')

		itemStatusServiceFindByID = jest.spyOn(itemStatusService, 'findById');

		service = new CheckoutService(checkoutHistoryService, itemStatusService);
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
