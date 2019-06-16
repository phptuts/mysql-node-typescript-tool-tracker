import { Repository } from "typeorm";

export class ViewEntityService<T> {

	constructor(protected repository: Repository<T>) {}

	public async findById(id: string): Promise<T> {
		return await this.repository.findOne(id);
	}
}
