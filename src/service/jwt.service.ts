import jwt from 'jsonwebtoken';
import path from 'path';
import { promises as fsPromise }  from 'fs'
import { User } from "../entity/user";
import { injectable } from "inversify";
import { UserService } from "./entity/user.service";
import "reflect-metadata";

@injectable()
export class JWTService {

	constructor(private userService: UserService) { }

	public async generateJWTToken(user: User): Promise<{ token: string, expirationTimestamp: number }> {
		const privateKey  = await fsPromise
				.readFile(
					path.join(__dirname, '..', '..', '.jwt', 'private.key'),
					'utf8'
				);

		let addMillisecondsToTimeStamp  =  10 * 60; // 10 minutes in milliseconds

		if (user.roles.includes('ROLE_ADMIN')) {
			addMillisecondsToTimeStamp =  30 * 60; // 30 minutes in milliseconds
		}

		const expirationTimeStamp = Math.floor(Date.now() / 1000)
			+ addMillisecondsToTimeStamp;

		const payload = {
			id: user.id,
			exp: expirationTimeStamp
		};

		const signOptions = {
			issuer:  process.env.JWT_ISSUER,
			subject:  user.id,
			audience:  process.env.JWT_AUDIENCE,
			algorithm:  "RS256",
		};

		return {
			token: jwt.sign( payload, privateKey, signOptions ),
			expirationTimestamp: expirationTimeStamp
		}
	}

	public async verifyJWTToken(token: string): Promise<false|User>  {

		const decoded = jwt.decode(token);

		const verifyOptions = {
			issuer:  process.env.JWT_ISSUER,
			subject:  decoded.sub,
			audience:  process.env.JWT_AUDIENCE,
			algorithms: ["RS256"]
		};

		try {
			const publicKeyPath = path.join(__dirname, '..', '..', '.jwt', 'public.key');
			const publicKey  = await fsPromise.readFile( publicKeyPath,'utf8');

			const payload  = jwt.verify(token, publicKey, verifyOptions) as { id: string };
			return await this.userService.findById(payload.id) || false;
		} catch (e) {
			console.log(e);
			return false
		}

	};
}



