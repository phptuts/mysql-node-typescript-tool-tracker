import { Repository } from "typeorm";

export class EntityService<T> {

	constructor(protected repository: Repository<T>) {}

	public async findById(id: string): Promise<T> {
		return await this.repository.findOne(id );
	}

	public async save(entity: T) {
		await this.repository.save<T>(entity, { reload: true });
	}
}
