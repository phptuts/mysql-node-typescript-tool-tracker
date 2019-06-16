import 'jest';
import { CheckoutHistory } from "./checkout-history";
import { User } from "./user";

describe('Checkout History', () => {

	it ('Checkout to know if item was returned', () => {
		const checkoutHistory = new CheckoutHistory();
		expect(checkoutHistory.userReturningItem).not.toBeDefined();
		expect(checkoutHistory.returnDate).not.toBeDefined();
		expect(checkoutHistory.isCheckedOut()).toBeTruthy();

		checkoutHistory.userReturningItem = new User();
		checkoutHistory.returnDate = new Date();

		expect(checkoutHistory.isCheckedOut()).toBeFalsy();
	});

});
