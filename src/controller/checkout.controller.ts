import { Controller, interfaces, Patch } from "inversify-restify-utils";
import { Response } from 'restify';
import { CheckoutService } from "../service/checkout.service";
import { inject, injectable } from "inversify";
import { authUser } from "../middleware/authenticate.middleware";
import { hasRole } from "../middleware/authorization.middleware";
import { ExtendedRequest } from "../model/request/extend.request";
import { TYPES } from "../container/types";
import { createResponse, ResponseTypes } from "../model/response/response.model";
import { ItemService } from "../service/entity/item.service";
import { ROLES } from "../entity/user";

@injectable()
@Controller("/", authUser, hasRole(ROLES.ROLE_USER))
export class CheckoutController implements interfaces.Controller{

	constructor(
		@inject(TYPES.ItemService) private itemService: ItemService,
		@inject(TYPES.CheckoutService) private checkoutService: CheckoutService) {}

	@Patch("/checkout/:rfid")
	public async checkoutItem(req: ExtendedRequest<void>, res: Response) {

		const item = await this.itemService.findByRfid(req.params['rfid']);

		if (!item) {
			res.status(404);

			return res.json(createResponse<string>(
				'Item not found', ResponseTypes.NOT_FOUND));
		}

		const canCheckoutItem =
			await this.checkoutService.canUserCheckItemOut(req.user, item);

		if (!canCheckoutItem.canCheckout) {

			res.status(400);
			return res.json(createResponse<string>(
				canCheckoutItem.reason, ResponseTypes.BAD_REQUEST));
		}

		await this.checkoutService.checkoutItem(req.user, item);

		return res.status(204)
	}
}
