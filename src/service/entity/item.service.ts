import { EntityService } from "./entity.service";
import { Item } from "../../entity/item";

export class ItemService extends EntityService<Item> {

	public async findByRfid(rfid: string) {
		return await this.repository.findOne({ rfid });
	}
}
