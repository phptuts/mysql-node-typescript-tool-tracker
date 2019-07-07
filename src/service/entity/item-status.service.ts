import { ViewEntityService } from "./view-entity.serivce";
import { ItemStatus } from "../../entity/item-status";

import "reflect-metadata";
import { injectable } from "inversify";
import { Item } from "../../entity/item";

@injectable()
export class ItemStatusService extends ViewEntityService<ItemStatus> {

	/**
	 * Returns a list of items the user currently has checked out
	 */
	public async itemsUserCurrentlyHasCheckout( userId: string): Promise<ItemStatus[]> {
		return await this.repository
			.find({ isCheckedOut: true, userIdCheckout: userId });
	}

	/**
	 * Find the item by rfid
	 *
	 * @param rfid
	 */
	public async findByRfid(rfid: string): Promise<ItemStatus> {
		return await this.repository.findOne({ rfid });
	}

}
