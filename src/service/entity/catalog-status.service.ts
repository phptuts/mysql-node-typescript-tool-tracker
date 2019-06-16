import { CatalogStatus } from "../../entity/catalog-status";
import { PaginatedMetaModel, ResponseModel } from "../../model/response/response.model";
import { PaginateService } from "../paginate.service";
import { CatalogStatusRepository } from "../../repository/catalog-status.repository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../container/types";
import { ViewEntityService } from "./view-entity.serivce";


@injectable()
export class CatalogStatusService extends ViewEntityService<CatalogStatus> {

	constructor(private readonly paginateService: PaginateService,
	            @inject(TYPES.CatalogStatusRepository) protected readonly repository: CatalogStatusRepository) {
		super(repository);
	}

	/**
	 * Gets a paginated response model for items in the catalog and their status.
	 */
	async search( page: number, availableOnly = false, term = '' ):
		Promise<ResponseModel<CatalogStatus[], PaginatedMetaModel>> {

		const pageSize = parseInt(process.env.PAGE_SIZE);

		const { data, total } = await this.repository
			.search( page, pageSize, availableOnly, term );

		return this.paginateService
			.createResponse<CatalogStatus>( data, total, page, pageSize, CatalogStatus.TYPE);
	}
}

