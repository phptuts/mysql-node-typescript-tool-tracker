import {  EntityRepository, Repository } from "typeorm";
import { ItemStatus } from "../entity/item-status";
import { User } from "../entity/user";
import { Item } from "../entity/item";

@EntityRepository(ItemStatus)
export class ItemStatusRepository extends Repository<ItemStatus> {

	/**
	 * Returns a list of items the user currently has checked out
	 */
	public async itemsUserCurrentlyHasCheckout( userId: string): Promise<ItemStatus[]> {
		return await this
			.find({ isCheckedOut: true, userIdCheckout: userId });
	}
}
