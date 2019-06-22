import { Controller, Post, interfaces,  } from 'inversify-restify-utils';
import { inject, injectable } from "inversify";
import { Request, Response } from 'restify';
import { JWTService } from "../service/jwt.service";
import { TYPES } from "../container/types";
import { UserService } from "../service/entity/user.service";
import { validate } from "class-validator";
import { LoginRequest } from "../model/request/login.request";


@injectable()
@Controller("/")
export class LoginController implements interfaces.Controller {

	constructor(@inject(TYPES.UserService) private userService: UserService,
	            private jwtService: JWTService) {}

	// always start with forward slash
	@Post("/login")
	async login(req: Request, res: Response) {

		const loginRequest = new LoginRequest(req.body.rfid || '');

		const errors = await validate(loginRequest);

		if (errors.length > 0) {
			console.log(errors);
			return res
				.json(401, { 'error': 'RFID number required' });
		}

		const user = await this.userService.findByRfid(loginRequest.rfid);

		if (!user) {
			return res
				.json(403, { 'error': 'Invalid RFID Number' });
		}

		if (!user.enabled) {
			return res
				.json(403,
					{ 'error': 'You are blocked from logging in, please contact the admin.' });
		}

		const jwtToken = await this.jwtService.generateJWTToken(user);

		return res.json(201, {
			token: jwtToken.token,
			exp: jwtToken.expirationTimestamp
		});
	}

}
