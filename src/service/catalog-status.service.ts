import { CatalogStatus } from "../entity/catalog-status";
import { PaginatedMetaModel, ResponseModel } from "../model/response/response.model";
import { createPaginatedResponse } from "./paginate.service";
import { CatalogStatusRepository } from "../repository/catalog-status.repository";
import { inject, injectable } from "inversify";
import { TYPES } from "../container/types";
import { getCustomRepository } from "typeorm";


@injectable()
export class CatalogStatusService {

	constructor( public readonly pageSize = 10 ) {
	}

	async search( page: number, availableOnly = false, term = '' ): Promise<ResponseModel<CatalogStatus[], PaginatedMetaModel>> {

		const { data, total } = await getCustomRepository( CatalogStatusRepository )
			.search( page, this.pageSize, availableOnly, term );

		return createPaginatedResponse<CatalogStatus>
		( data, total, page, this.pageSize, CatalogStatus.TYPE );
	}
}

