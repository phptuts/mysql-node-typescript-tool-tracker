import 'jest';
import { CheckoutService } from "./checkout.service";
import { Repository } from "typeorm";
import { CheckoutHistory } from "../entity/checkout-history";
import { User } from "../entity/user";
import { Item } from "../entity/item";


describe('Checkout Service', () => {

	let service: CheckoutService;

	let checkoutRepository: Repository<CheckoutHistory>|any;

	let checkoutRepositorySpy: jest.SpyInstance;

	beforeEach(async () => {
		checkoutRepository = {
			save(checkoutHistory: CheckoutHistory): Promise<CheckoutHistory> {
				return Promise.resolve(undefined);
			}
		};

		checkoutRepositorySpy = jest.spyOn(checkoutRepository, 'save');

		service = new CheckoutService(checkoutRepository);
	});

	it ('should create a new checkout entry in the database and save', async () =>{
		checkoutRepositorySpy.mockImplementation(checkoutHistory =>
			Promise.resolve(checkoutHistory));

		const user = new User();
		const item = new Item();
		const checkoutHistory = await service.checkoutItem(user, item);

		expect(checkoutRepositorySpy).toHaveBeenCalledWith(expect.any(CheckoutHistory));
		expect(checkoutHistory.item).toBe(item);
		expect(checkoutHistory.userCheckoutItem).toBe(user);
	});
});
