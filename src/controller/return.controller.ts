import { Controller, interfaces, Patch, Post, } from 'inversify-restify-utils';
import { ExtendedRequest } from "../model/request/extend.request";
import { inject, injectable } from "inversify";
import { Response } from 'restify';
import { authUser } from "../middleware/authenticate.middleware";
import { hasRole } from "../middleware/authorization.middleware";
import { ItemStatusService } from "../service/entity/item-status.service";
import { createResponse, ResponseTypes } from "../model/response/response.model";
import { ReturnService } from "../service/return.service";
import { ReturnRequest } from "../model/request/return.request";
import { validateRequest } from "../middleware/validate.middleware";
import { TYPES } from "../container/types";

@injectable()
@Controller("/", authUser, hasRole('ROLE_USER'))
export class ReturnController implements interfaces.Controller {

	constructor(
		@inject(TYPES.ItemStatusService) private itemStatusService: ItemStatusService,
		@inject(TYPES.ReturnService) private returnService: ReturnService) {}


	@Patch("/return-item/:rfid", validateRequest(ReturnRequest))
	public async returnItem(req: ExtendedRequest<ReturnRequest>, res: Response) {
		const itemStatus = await this.itemStatusService.findByRfid(req.params['rfid']);

		if (!itemStatus) {
			res.status(404);

			return res.json(createResponse<string>(
				'Item not found', ResponseTypes.NOT_FOUND));
		}

		if (!itemStatus.isCheckedOut) {
			res.status(400);

			return res.json(createResponse<string>(
				'Item has already been returned.', ResponseTypes.BAD_REQUEST));
		}

		await this.returnService.returnItem(req.user, itemStatus, req.validatedObject.damaged, req.validatedObject.notes);

		return res.status(204);
	}
}
