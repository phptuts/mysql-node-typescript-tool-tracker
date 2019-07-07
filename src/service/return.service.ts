
import { CheckoutHistory } from "../entity/checkout-history";
import { User } from "../entity/user";
import { Item } from "../entity/item";
import { ItemStatus } from "../entity/item-status";
import { injectable } from "inversify";
import { EntityService } from "./entity/entity.service";
import { ItemService } from "./entity/item.service";

@injectable()
export class ReturnService {

	constructor(private checkoutHistoryService: EntityService<CheckoutHistory>,
	            private itemService: ItemService) {}

	/**
	 * Returns an item
	 */
	public async returnItem( user: User,
							 itemStatus: ItemStatus,
	                         isDamaged: boolean,
	                         returnNote: string ):
		Promise<{checkOutHistory: CheckoutHistory, item: Item}> {

		const [item, checkOutHistory] = await Promise.all<Item, CheckoutHistory>([
			this.itemService.findById(itemStatus.itemId),
			this.checkoutHistoryService.findById( itemStatus.checkoutHistoryId )
		]);

		checkOutHistory.userReturningItem = user;
		checkOutHistory.returnDate = new Date();
		checkOutHistory.damaged = isDamaged;
		checkOutHistory.note = returnNote;

		item.damaged = isDamaged;

		try {
			await Promise.all([
				this.checkoutHistoryService.save( checkOutHistory ),
				this.itemService.save(item)
			]);
		} catch (e) {
			console.log(e, 'error');
		}


		return {
			checkOutHistory,
			item
		};
	}
}
