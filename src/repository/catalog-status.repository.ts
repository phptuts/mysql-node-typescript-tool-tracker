import { EntityRepository, FindManyOptions, Like, MoreThan, Repository } from "typeorm";
import { CatalogStatus } from "../entity/catalog-status";
import { injectable } from "inversify";

@injectable()
@EntityRepository(CatalogStatus)
export class CatalogStatusRepository extends Repository<CatalogStatus>  {

	async paginatedSearch( page: number, pageSize: number, availableOnly = false, term = ''): Promise<{
		data: CatalogStatus[],
		total: number
	}>  {

		const findOptions: FindManyOptions<CatalogStatus>| any = { where: {} };
		if (availableOnly) {
			findOptions.where.numberOfItemAvailable = MoreThan(0);
		}

		if (term.length > 0) {
			findOptions.where.name = Like('%' + term + '%');
		}

		findOptions.skip = pageSize * (page - 1);

		findOptions.take = pageSize;

		findOptions.order = { name: 'ASC' };

		const [result, total] = await this.findAndCount(findOptions);

		return {
			data: result,
			total
		};
	}

}
