import { inject, injectable } from "inversify";
import { Controller, interfaces, Post } from "inversify-restify-utils";
import { authUser } from "../../middleware/authenticate.middleware";
import { hasRole } from "../../middleware/authorization.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { RegisterRequest } from "../../model/request/register.request";
import { ROLES, User } from "../../entity/user";
import { ExtendedRequest } from "../../model/request/extend.request";
import { UserService } from "../../service/entity/user.service";
import { TYPES } from "../../container/types";
import { createResponse, MetaResponseModel, ResponseModel, ResponseTypes } from "../../model/response/response.model";

@injectable()
@Controller("/admin", authUser, hasRole(ROLES.ROLE_ADMIN))
export class RegisterController implements interfaces.Controller {

	constructor(@inject(TYPES.UserService) private userService: UserService) {}

	@Post("/user", validateRequest<RegisterRequest>(RegisterRequest))
	public async registerUser(req: ExtendedRequest<RegisterRequest>, res):
				Promise<ResponseModel<User, MetaResponseModel>> {
		const user = new User();
		user.blockCheckout = false;
		user.enabled = true;
		user.roles = req.validatedObject.roles;
		user.email = req.validatedObject.email;
		user.phone = req.validatedObject.phone;
		user.rfid = req.validatedObject.rfid;

		await this.userService.save(user);

		res.status(201);

		return createResponse<User>(user, ResponseTypes.REGISTER_USER);
	}
}
