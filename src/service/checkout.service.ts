import { injectable } from "inversify";
import { Repository } from "typeorm";
import { CheckoutHistory } from "../entity/checkout-history";
import { User } from "../entity/user";
import { Item } from "../entity/item";

@injectable()
export class CheckoutService {

	constructor(private checkoutHistoryRepository: Repository<CheckoutHistory>) {}

	/**
	 * Creates an entry for checking an item out
	 */
	public async checkoutItem( user: User, item: Item ): Promise<CheckoutHistory> {

		const checkoutHistoryEntry = new CheckoutHistory();
		checkoutHistoryEntry.item = item;
		checkoutHistoryEntry.checkoutDate = new Date();
		checkoutHistoryEntry.userCheckoutItem = user;

		return await this.checkoutHistoryRepository.save(checkoutHistoryEntry);
	}

}
