import { injectable } from "inversify";
import { CheckoutHistory } from "../entity/checkout-history";
import { ROLES, User } from "../entity/user";
import { Item } from "../entity/item";
import { EntityService } from "./entity/entity.service";
import { ItemStatusService } from "./entity/item-status.service";

@injectable()
export class CheckoutService {

	constructor(private checkoutHistoryService: EntityService<CheckoutHistory>,
	            private itemStatusService: ItemStatusService) {}

	/**
	 * Creates an entry for checking an item out
	 */
	public async checkoutItem( user: User, item: Item ): Promise<CheckoutHistory> {

		const checkoutHistoryEntry = new CheckoutHistory();
		checkoutHistoryEntry.item = item;
		checkoutHistoryEntry.checkoutDate = new Date();
		checkoutHistoryEntry.userCheckoutItem = user;

		return (await this.checkoutHistoryService.save(checkoutHistoryEntry)) as CheckoutHistory;
	}

	/**
	 * Returns true if the user can checkout the item
	 */
	public async canUserCheckItemOut(user: User, item: Item): Promise<{ canCheckout: boolean, reason?: string }> {

		if (user.blockCheckout || !user.enabled) {
			return { canCheckout: false, reason: 'User is not enabled' };
		}

		const itemStatus = await this.itemStatusService.findById(item.id);

		if (itemStatus.isCheckedOut) {
			return { canCheckout: false, reason: 'Item is already checked out.' };
		}

		if (itemStatus.damaged && !user.roles.includes(ROLES.ROLE_ADMIN)) {
			return { canCheckout: false, reason: 'Item is damaged and can only be checked out by and admin.' };
		}

		return { canCheckout: true };
	}

}
