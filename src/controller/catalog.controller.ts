import { CatalogStatusService } from "../service/entity/catalog-status.service";
import { Controller, Get, interfaces, } from 'inversify-restify-utils';
import { PaginatedMetaModel, ResponseModel } from "../model/response/response.model";
import { CatalogStatus } from "../entity/catalog-status";
import { inject, injectable } from "inversify";
import { Request } from 'restify';
import { authUser } from "../middleware/authenticate.middleware";
import { hasRole } from "../middleware/authorization.middleware";
import { TYPES } from "../container/types";
import { ROLES } from "../entity/user";


@injectable()
@Controller("/", authUser, hasRole(ROLES.ROLE_USER))
export class CatalogController implements interfaces.Controller {

	constructor(@inject(TYPES.CatalogStatusService) private readonly catalogStatusService: CatalogStatusService) { }

	@Get("/catalog-search")
	public async search(req: Request): Promise<ResponseModel<CatalogStatus, PaginatedMetaModel>> {

		const term = req.query.term || '';
		const page = parseInt(req.query.page) || 1;
		const availableOnly = req.query.availableOnly === '1';

		return await this.catalogStatusService.search(page, availableOnly, term);
	}

	// Get's an catalog item
	public async get() {

	}

	public async add() {

	}

	public async edit() {

	}
}
