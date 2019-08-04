import 'jest';
import { ReturnService } from "./return.service";
import { Item } from "../entity/item";
import { CheckoutHistory } from "../entity/checkout-history";
import { ItemStatus } from "../entity/item-status";
import { User } from "../entity/user";
import { EntityService } from "./entity/entity.service";
import { ItemService } from "./entity/item.service";

describe('Return Service', () => {

	let service: ReturnService;

	let checkoutHistoryServiceSaveSpy: jest.SpyInstance;

	let checkoutHistoryServiceFindByIdSpy: jest.SpyInstance;

	let itemServiceFindByIdSpy: jest.SpyInstance;

	let itemServiceSaveSpy: jest.SpyInstance;

	let itemService: ItemService|any;

	let checkoutHistoryService: EntityService<CheckoutHistory>|any;

	beforeEach(() => {
		itemService = {
			save(item: Item): Promise<Item> {
				return Promise.resolve(undefined);
			},

			findById( id: string): Promise<Item | undefined> {
				return Promise.resolve(undefined)
			}
		};

		checkoutHistoryService = {
			save(item: Item): Promise<CheckoutHistory> {
				return Promise.resolve(undefined);
			},

			findById( id: string): Promise<CheckoutHistory | undefined> {
				return Promise.resolve(undefined)
			}
		};

		service = new ReturnService(checkoutHistoryService, itemService);

		itemServiceFindByIdSpy = jest.spyOn(itemService, 'findById');
		itemServiceSaveSpy = jest.spyOn(itemService, 'save');

		checkoutHistoryServiceFindByIdSpy = jest.spyOn(checkoutHistoryService, 'findById');
		checkoutHistoryServiceSaveSpy = jest.spyOn(checkoutHistoryService, 'save');
	});

	it ('Returns an item to the with the damaged flag and notes saved.', async () => {
		const itemStatus = new ItemStatus();
		itemStatus.itemId = 'fake_item_id';
		itemStatus.checkoutHistoryId = 'fake_checkout_history_id';
		const user = new User();

		const itemInMock = new Item();
		const checkoutHistory = new CheckoutHistory();

		itemServiceFindByIdSpy.mockImplementation(() =>
			Promise.resolve(itemInMock));
		itemServiceSaveSpy.mockImplementation(foundItem =>
			Promise.resolve(foundItem));

		checkoutHistoryServiceFindByIdSpy.mockImplementation(() =>
			Promise.resolve(checkoutHistory));
		checkoutHistoryServiceSaveSpy.mockImplementation(history =>
			Promise.resolve(history));

		const { checkOutHistory, item } = await service
			.returnItem(user, itemStatus, true, 'This item was damaged');

		expect(itemServiceSaveSpy).toHaveBeenCalledWith(item);
		expect(itemServiceFindByIdSpy).toHaveBeenCalledWith('fake_item_id');

		expect(checkoutHistoryServiceSaveSpy).toHaveBeenCalledWith(checkoutHistory);
		expect(checkoutHistoryServiceFindByIdSpy).toHaveBeenCalledWith('fake_checkout_history_id');

		expect(checkOutHistory.userReturningItem).toBe(user);
		expect(checkOutHistory.returnDate.toDateString()).toEqual(new Date().toDateString());
		expect(checkOutHistory.damaged).toBeTruthy();
		expect(checkOutHistory.note).toBe('This item was damaged');

	});

});
