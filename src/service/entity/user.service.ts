import { injectable } from "inversify";
import { User } from "../../entity/user";
import { EntityService } from "./entity.service";

@injectable()
export class UserService extends EntityService<User>{

	public async findByRfid(rfid: string) {
		return await this.repository.findOne({ rfid });
	}

	public async findByEmail(email: string) {
		return await this.repository.findOne({ email });
	}

}
