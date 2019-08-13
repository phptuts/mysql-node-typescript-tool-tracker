import { inject, injectable } from "inversify";
import { Controller, Patch, Post } from "inversify-restify-utils";
import { upload } from "../file";
import { Response } from "restify";
import { FileRequest } from "../model/request/file.request";
import { authUser } from "../middleware/authenticate.middleware";
import { hasRole } from "../middleware/authorization.middleware";
import { ROLES, User } from "../entity/user";
import { FileService } from "../service/file.service";
import { UserService } from "../service/entity/user.service";
import { TYPES } from "../container/types";
import { validateRequest } from "../middleware/validate.middleware";
import { RegisterRequest } from "../model/request/register.request";
import { ExtendedRequest } from "../model/request/extend.request";
import { createResponse, MetaResponseModel, ResponseModel, ResponseTypes } from "../model/response/response.model";


@injectable()
@Controller("/user", authUser, hasRole(ROLES.ROLE_USER))
export class UserController {

	constructor(@inject(TYPES.FileService) private fileService: FileService,
	            @inject(TYPES.UserService) private userService: UserService) {}

	@Post(
		"/",
		hasRole(ROLES.ROLE_ADMIN),
		validateRequest<RegisterRequest>(RegisterRequest)
	)
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


	@Patch("/{id}/update-picture", upload.single('picture'))
	public async updatePicture(req: FileRequest, res: Response) {

		req.user.imageUrl = this.fileService.uploadUserPhoto(req.user, req.file);

		await this.userService.save(req.user);

		res.status(204);

		return res.send('');
	}

	// updating the user
	@Patch("/{id}")
	public async update() {

	}

	@Patch("/{id}/block")
	public async block() {

	}

	@Patch("/{id}/unblock")
	public async unBlock() {

	}


}
