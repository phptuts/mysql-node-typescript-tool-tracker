
import { Repository } from "typeorm";
import { CheckoutHistory } from "../entity/checkout-history";
import { User } from "../entity/user";
import { Item } from "../entity/item";
import { ItemStatus } from "../entity/item-status";

export class ReturnService {

	constructor(private checkoutHistoryRepository: Repository<CheckoutHistory>,
	            private itemRepository: Repository<Item>) {}

	/**
	 * Returns an item
	 */
	public async returnItem( user: User,
							 itemStatus: ItemStatus,
	                         isDamaged: boolean,
	                         returnNote: string ):
		Promise<{checkOutHistory: CheckoutHistory, item: Item}> {

		const [item, checkOutHistory] = await Promise.all<Item, CheckoutHistory>([
			this.itemRepository.findOne(itemStatus.itemId),
			this.checkoutHistoryRepository.findOne( itemStatus.checkoutHistoryId )
		]);

		checkOutHistory.userReturningItem = user;
		checkOutHistory.returnDate = new Date();
		checkOutHistory.damaged = isDamaged;
		checkOutHistory.note = returnNote;

		item.damaged = isDamaged;

		await Promise.all([
			this.checkoutHistoryRepository.save( checkOutHistory ),
			this.itemRepository.save(item)
		]);

		return {
			checkOutHistory,
			item
		};
	}
}
