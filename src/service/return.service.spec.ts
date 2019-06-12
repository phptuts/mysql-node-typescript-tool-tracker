import 'jest';
import { ReturnService } from "./return.service";
import { Repository } from "typeorm";
import { Item } from "../entity/item";
import { CheckoutHistory } from "../entity/checkout-history";
import { ItemStatus } from "../entity/item-status";
import { User } from "../entity/user";

describe('Return Service', () => {

	let service: ReturnService;

	let checkoutRepositorySaveSpy: jest.SpyInstance;

	let checkoutRepositoryFindOneSpy: jest.SpyInstance;

	let itemRepositoryFindOneSpy: jest.SpyInstance;

	let itemRepositorySaveSpy: jest.SpyInstance;

	let itemRepository: Repository<Item>|any;

	let checkoutRepository: Repository<CheckoutHistory>|any;

	beforeEach(() => {
		itemRepository = {
			save(item: Item): Promise<Item> {
				return Promise.resolve(undefined);
			},

			findOne( id: string): Promise<Item | undefined> {
				return Promise.resolve(undefined)
			}
		};

		checkoutRepository = {
			save(item: Item): Promise<Item> {
				return Promise.resolve(undefined);
			},

			findOne( id: string): Promise<Item | undefined> {
				return Promise.resolve(undefined)
			}
		};

		service = new ReturnService(checkoutRepository, itemRepository);

		itemRepositoryFindOneSpy = jest.spyOn(itemRepository, 'findOne');
		itemRepositorySaveSpy = jest.spyOn(itemRepository, 'save');

		checkoutRepositoryFindOneSpy = jest.spyOn(checkoutRepository, 'findOne');
		checkoutRepositorySaveSpy = jest.spyOn(checkoutRepository, 'save');
	});

	it ('Returns an item to the with the damaged flag and notes saved.', async () => {
		const itemStatus = new ItemStatus();
		itemStatus.itemId = 'fake_item_id';
		itemStatus.checkoutHistoryId = 'fake_checkout_history_id';
		const user = new User();

		const itemInMock = new Item();
		const checkoutHistory = new CheckoutHistory();

		itemRepositoryFindOneSpy.mockImplementation(() =>
			Promise.resolve(itemInMock));
		itemRepositorySaveSpy.mockImplementation(foundItem =>
			Promise.resolve(foundItem));

		checkoutRepositoryFindOneSpy.mockImplementation(() =>
			Promise.resolve(checkoutHistory));
		checkoutRepositorySaveSpy.mockImplementation(history =>
			Promise.resolve(history));

		const { checkOutHistory, item } = await service
			.returnItem(user, itemStatus, true, 'This item was damaged');

		expect(itemRepositorySaveSpy).toHaveBeenCalledWith(item);
		expect(itemRepositoryFindOneSpy).toHaveBeenCalledWith('fake_item_id');

		expect(checkoutRepositorySaveSpy).toHaveBeenCalledWith(checkoutHistory);
		expect(checkoutRepositoryFindOneSpy).toHaveBeenCalledWith('fake_checkout_history_id');

		expect(checkOutHistory.userReturningItem).toBe(user);
		expect(checkOutHistory.returnDate.toDateString()).toEqual(new Date().toDateString());
		expect(checkOutHistory.damaged).toBeTruthy();
		expect(checkOutHistory.note).toBe('This item was damaged');

	});

});
