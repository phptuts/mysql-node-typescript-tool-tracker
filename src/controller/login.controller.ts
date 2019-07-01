import { Controller, interfaces, Post, } from 'inversify-restify-utils';
import { inject, injectable } from "inversify";
import { Response } from 'restify';
import { JWTService } from "../service/jwt.service";
import { TYPES } from "../container/types";
import { UserService } from "../service/entity/user.service";
import { LoginRequest } from "../model/request/login.request";
import { validateRequest } from "../middleware/validate.middleware";
import { ExtendedRequest } from "../model/request/extend-request";
import { createResponse, ResponseTypes } from "../model/response/response.model";


@injectable()
@Controller("/")
export class LoginController implements interfaces.Controller {

	constructor(@inject(TYPES.UserService) private userService: UserService,
	            private jwtService: JWTService) {}

	// always start with forward slash
	@Post("/login", validateRequest<LoginRequest>(LoginRequest,null, 403, ResponseTypes.ACCESS_DENIED))
	async login(req: ExtendedRequest<LoginRequest>, res: Response) {

		const user = await this.userService.findByRfid(req.validatedObject.rfid);

		if (!user) {
			res.status(403);
			return res
				.json(createResponse<string>(
					'Invalid RFID', ResponseTypes.ACCESS_DENIED));
		}

		if (!user.enabled) {

			res.status(403);
			return res
				.json(createResponse<string>(
					'User has been blocked.', ResponseTypes.ACCESS_DENIED));

		}

		const jwtToken = await this.jwtService.generateJWTToken(user);

		res.status(201);
		return res
			.json(createResponse<{ token: string, exp: number }> ( {
						token: jwtToken.token,
						exp: jwtToken.expirationTimestamp
					}, ResponseTypes.AUTH_TOKEN));
	}

}
