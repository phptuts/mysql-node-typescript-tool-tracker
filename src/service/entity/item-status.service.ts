import { ViewEntityService } from "./view-entity.serivce";
import { ItemStatus } from "../../entity/item-status";

export class ItemStatusService extends ViewEntityService<ItemStatus> {

	/**
	 * Returns a list of items the user currently has checked out
	 */
	public async itemsUserCurrentlyHasCheckout( userId: string): Promise<ItemStatus[]> {
		return await this.repository
			.find({ isCheckedOut: true, userIdCheckout: userId });
	}

}
