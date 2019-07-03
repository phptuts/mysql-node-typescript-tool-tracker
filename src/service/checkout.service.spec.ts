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
	const user = new User();
	user.enabled = true;
	user.blockCheckout = false;
	user.roles = ['ROLE_USER'];

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

		const item = new Item();
		const checkoutHistory = await service.checkoutItem(user, item);

		expect(checkoutHistoryServiceSaveSpy).toHaveBeenCalledWith(expect.any(CheckoutHistory));
		expect(checkoutHistory.item).toBe(item);
		expect(checkoutHistory.userCheckoutItem).toBe(user);
	});

	it ('should return false if item is checked out', async () => {
		const itemStatus = new ItemStatus();
		itemStatus.isCheckedOut = true;

		const item = new Item();


		itemStatusServiceFindByID.mockImplementation(() => itemStatus);

		const message = await service.canUserCheckItemOut(user, item);

		expect(message.canCheckout).toBeFalsy();
	});

	it ('should return false if the item is damaged and user is not an admin', async () => {
		const itemStatus = new ItemStatus();
		itemStatus.isCheckedOut = false;
		itemStatus.damaged = true;

		const item = new Item();

		itemStatusServiceFindByID.mockImplementation(() => itemStatus);

		const message = await service.canUserCheckItemOut(user, item);

		expect(message.canCheckout).toBeFalsy();
	});

	it('should return true if the item is damaged and user is admin', async () => {
		const itemStatus = new ItemStatus();
		itemStatus.isCheckedOut = false;
		itemStatus.damaged = true;

		user.roles = ['ROLE_ADMIN'];
		const item = new Item();

		itemStatusServiceFindByID.mockImplementation(() => itemStatus);

		const message = await service.canUserCheckItemOut(user, item);

		expect(message.canCheckout).toBeTruthy();

	});

	it('should return true if the item is not damaged and can be checkedout', async () => {
		const itemStatus = new ItemStatus();
		itemStatus.isCheckedOut = false;
		itemStatus.damaged = false;

		const item = new Item();

		itemStatusServiceFindByID.mockImplementation(() => itemStatus);

		const message = await service.canUserCheckItemOut(user, item);

		expect(message.canCheckout).toBeTruthy();
	});

	it ('should not allow blocked user to checkout tool', async () => {
		const itemStatus = new ItemStatus();
		itemStatus.isCheckedOut = false;
		itemStatus.damaged = false;
		const item = new Item();

		user.enabled = false;

		itemStatusServiceFindByID.mockImplementation(() => itemStatus);

		const message = await service.canUserCheckItemOut(user, item);

		expect(message.canCheckout).toBeFalsy();

	});

	it ('should not allow block checkout to checkout tool', async () => {
		const itemStatus = new ItemStatus();
		itemStatus.isCheckedOut = false;
		itemStatus.damaged = false;
		const item = new Item();

		user.blockCheckout = true;

		itemStatusServiceFindByID.mockImplementation(() => itemStatus);

		const message = await service.canUserCheckItemOut(user, item);

		expect(message.canCheckout).toBeFalsy();

	});
});
