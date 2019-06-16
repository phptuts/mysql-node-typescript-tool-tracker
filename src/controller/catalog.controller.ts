import { CatalogStatusService } from "../service/entity/catalog-status.service";
import { Controller, Get, interfaces,  } from 'inversify-restify-utils';
import { PaginatedMetaModel, ResponseModel } from "../model/response/response.model";
import { CatalogStatus } from "../entity/catalog-status";
import { injectable } from "inversify";
import { Request } from 'restify';
import { authUser } from "../middleware/authenticate.middleware";
import { hasRole } from "../middleware/authorization.middleware";


@injectable()
@Controller("/", authUser)
export class CatalogController implements interfaces.Controller {

	constructor(private readonly catalogStatusService: CatalogStatusService) { }

	@Get("/catalog-search", hasRole("ROLE_USER"))
	async search(req: Request):
		Promise<ResponseModel<CatalogStatus[], PaginatedMetaModel>> {

		const term = req.query.term || '';
		const page = parseInt(req.query.page) || 1;
		const availableOnly = req.query.availableOnly || false;

		return await this.catalogStatusService.search(page, availableOnly, term);
	}
}
