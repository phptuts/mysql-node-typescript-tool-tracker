import { Repository } from "typeorm";
import { CheckoutHistory } from "../entity/checkout-history";
import { User } from "../entity/user";
import { Item } from "../entity/item";
import { inject, injectable } from "inversify";
import { ItemStatusRepository } from "../repository/item-status.repository";
import { TYPES } from "../container/types";

@injectable()
export class ItemService {

	constructor(@inject(TYPES.CheckoutHistoryRepository) private checkoutHistoryRepository: Repository<CheckoutHistory>,
	            @inject(TYPES.ItemStatusRepository)  private itemStatusRepository: ItemStatusRepository) {}

	public async returnItem( user: User, item: Item ): Promise<ReturnStatus> {

			const itemStatus = await this.itemStatusRepository
				.findOne( { itemId: item.id } );

			if (!itemStatus) {
				return ReturnStatus.NOT_FOUND;
			}

			if (!itemStatus.isCheckedOut) {
				return ReturnStatus.ALREADY_RETURNED;
			}

			const checkOutHistory = await this.checkoutHistoryRepository.findOne( itemStatus.checkoutHistoryId );

			checkOutHistory.userReturningItem = user;
			checkOutHistory.returnDate = new Date();

			await this.checkoutHistoryRepository.save( checkOutHistory );

			return ReturnStatus.SUCCESSFUL_RETURNED;
	}

	public async checkoutItem( user: User, item: Item ) {
		const itemStatus = await this
			.itemStatusRepository
			.findOne( { itemId: item.id } );

		if (!itemStatus) {
			return CheckoutStatus.NOT_FOUND;
		}

		if (itemStatus.isCheckedOut) {
			return CheckoutStatus.ALREADY_CHECKEDOUT;
		}

		const checkoutHistoryEntry = new CheckoutHistory();
		checkoutHistoryEntry.item = item;
		checkoutHistoryEntry.checkoutDate = new Date();
		checkoutHistoryEntry.userCheckoutItem = user;

		await this.checkoutHistoryRepository.save(checkoutHistoryEntry);

		return CheckoutStatus.CHECKED_OUT;
	}

}

export enum ReturnStatus {
	NOT_FOUND,
	ALREADY_RETURNED,
	SUCCESSFUL_RETURNED
}

export enum CheckoutStatus {
	NOT_FOUND,
	ALREADY_CHECKEDOUT,
	CHECKED_OUT,

}
