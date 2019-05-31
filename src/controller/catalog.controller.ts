import { CatalogStatusService } from "../service/catalog-status.service";
import { Controller, Get, interfaces,  } from 'inversify-restify-utils';
import { PaginatedMetaModel, ResponseModel } from "../model/response/response.model";
import { CatalogStatus } from "../entity/catalog-status";
import { TYPES } from "../container/types";
import { inject, injectable } from "inversify";
import { Request } from 'restify';

@injectable()
@Controller("/")
export class CatalogController implements interfaces.Controller {

	constructor(@inject(TYPES.CatalogStatusService) private readonly catalogStatusService: CatalogStatusService) { }

	@Get("/catalog-search")
	async search(req: Request):
		Promise<ResponseModel<CatalogStatus[], PaginatedMetaModel>> {

		const term = req.query.term || '';
		const page = parseInt(req.query.page) || 1;
		const availableOnly = req.query.availableOnly || false;

		return await this.catalogStatusService.search(page, availableOnly, term);
	}
}
