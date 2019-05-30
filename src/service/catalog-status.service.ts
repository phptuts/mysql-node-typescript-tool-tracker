import { CatalogStatus } from "../entity/catalog-status";
import { PaginatedMetaModel, ResponseModel } from "../model/response/response.model";
import { PaginateService } from "./paginate.service";
import { CatalogStatusRepository } from "../repository/catalog-status.repository";
import { inject, injectable } from "inversify";
import { EntityManager } from "typeorm";
import { TYPES } from "../container/types";


@injectable()
export class CatalogStatusService {

	constructor(@inject(TYPES.PaginatedService) private readonly paginateService: PaginateService,
	            @inject(TYPES.EntityManager) private readonly entityManager: EntityManager) {}

	/**
	 * Gets a paginated response model for items in the catalog and their status.
	 */
	async search( page: number, availableOnly = false, term = '' ):
		Promise<ResponseModel<CatalogStatus[], PaginatedMetaModel>> {

		const pageSize = parseInt(process.env.PAGE_SIZE);

		const { data, total } = await this
			.entityManager
			.getCustomRepository( CatalogStatusRepository )
			.search( page, pageSize, availableOnly, term );

		return this.paginateService
			.createResponse<CatalogStatus>( data, total, page, pageSize, CatalogStatus.TYPE);
	}
}

