import { Repository } from "typeorm";
import "reflect-metadata";
import { injectable } from "inversify";
import { CheckoutHistory } from "../../entity/checkout-history";

@injectable()
export class EntityService<T> {

	constructor(protected repository: Repository<T>) {}

	public async findById(id: string): Promise<T> {
		return await this.repository.findOne(id );
	}

	public async save(entity: T): Promise<T> {
		return await this.repository.save<T>(entity, { reload: true });
	}
}
