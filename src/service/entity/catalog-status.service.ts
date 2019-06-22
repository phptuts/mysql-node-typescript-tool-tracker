import { CatalogStatus } from "../../entity/catalog-status";
import { PaginateService } from "../paginate.service";
import { CatalogStatusRepository } from "../../repository/catalog-status.repository";
import { injectable } from "inversify";
import { ViewEntityService } from "./view-entity.serivce";
import "reflect-metadata";


@injectable()
export class CatalogStatusService extends ViewEntityService<CatalogStatus> {

	constructor(private readonly paginateService: PaginateService,
	            protected readonly repository: CatalogStatusRepository) {
		super(repository);
	}

	/**
	 * Gets a paginated response model for items in the catalog and their status.
	 */
	async search( page: number, availableOnly = false, term = '' ):
		Promise<any> {
		const pageSize = parseInt(process.env.PAGE_SIZE);

		const { data, total } = await this.repository
			.paginatedSearch( page, pageSize, availableOnly, term );

		return this.paginateService
			.createResponse<CatalogStatus>( data, total, page, pageSize, CatalogStatus.TYPE);
	}
}

