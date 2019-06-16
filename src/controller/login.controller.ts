import { Controller, Post, interfaces,  } from 'inversify-restify-utils';
import { inject, injectable } from "inversify";
import { Request, Response } from 'restify';
import { Repository } from "typeorm";
import { User } from "../entity/user";
import { JWTService } from "../service/jwt.service";
import { TYPES } from "../container/types";


@injectable()
@Controller("/")
export class LoginController implements interfaces.Controller {

	constructor(@inject(TYPES.UserRepository) private userRepository: Repository<User>,
	            private jwtService: JWTService) {}

	@Post("login")
	async login(req: Request, res: Response) {

		const rfid = req.body.rfid;

		if (!rfid) {
			return res
				.json(401, { 'error': 'RFID number required' });
		}

		const user = await this.userRepository.findOne({ rfid })

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
			token: jwtToken
		});
	}

}
