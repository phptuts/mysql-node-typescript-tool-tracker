import { getCustomRepository, getRepository, Repository } from "typeorm";
import { CheckoutHistory } from "../entity/checkout-history";
import { User } from "../entity/user";
import { Item } from "../entity/item";
import { injectable } from "inversify";
import { ItemStatusRepository } from "../repository/item-status.repository";

@injectable()
export class ItemService {

	private itemStatusRepository: ItemStatusRepository;

	private checkoutHistoryRepository: Repository<CheckoutHistory>;

	constructor() {
		this.itemStatusRepository = getCustomRepository( ItemStatusRepository );
		this.checkoutHistoryRepository = getRepository( CheckoutHistory );

	}

	public async returnItem( user: User, item: Item ): Promise<ReturnStatus> {
		try {


			const itemStatus = await this.itemStatusRepository
				.findOne( { itemId: item.id } );

			if (!itemStatus) {
				return ReturnStatus.ITEM_NOT_FOUND;
			}

			if (!itemStatus.isCheckedOut) {
				return ReturnStatus.ITEM_ALREADY_RETURNED;
			}

			const checkOutHistory = await this.checkoutHistoryRepository.findOne( itemStatus.checkoutHistoryId );

			checkOutHistory.userReturningItem = user;
			checkOutHistory.returnDate = new Date();

			await this.checkoutHistoryRepository.save( checkOutHistory );

			return ReturnStatus.ITEM_SUCCESSFUL_RETURNED;
		} catch (e) {
			console.error( e );
			return ReturnStatus.SYSTEM_ERROR;
		}
	}

	public async checkoutItem( user: User, item: Item ) {
		const itemStatus = await this
			.itemStatusRepository
			.findOne( { itemId: item.id } );

	}

}

export enum ReturnStatus {
	ITEM_NOT_FOUND,
	ITEM_ALREADY_RETURNED,
	ITEM_SUCCESSFUL_RETURNED,
	SYSTEM_ERROR
}
