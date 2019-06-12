import jwt from 'jsonwebtoken';
import path from 'path';
import { promises as fsPromise }  from 'fs'
import { User } from "../entity/user";
import { Repository } from "typeorm";
import { injectable } from "inversify";

@injectable()
export class JWTService {

	constructor(private userRepository: Repository<User>) { }

	public async generateJWTToken(user: User): Promise<string> {
		const privateKey  = await fsPromise
				.readFile(
					path.join(__dirname, '..', '..', '.jwt', 'private.key'),
					'utf8'
				);

		const payload = {
			id: user.id,
		};

		const signOptions = {
			issuer:  process.env.JWT_ISSUER,
			subject:  user.id,
			audience:  process.env.JWT_AUDIENCE,
			expiresIn:  "12h",
			algorithm:  "RS256"
		};

		return jwt.sign(payload, privateKey, signOptions);
	}

	public async verifyJWTToken(token: string): Promise<false|User>  {

		const decoded = jwt.decode(token);

		const verifyOptions = {
			issuer:  process.env.JWT_ISSUER,
			subject:  decoded.sub,
			audience:  process.env.JWT_AUDIENCE,
			expiresIn:  "12h",
			algorithms: ["RS256"]
		};

		try {
			const publicKeyPath = path.join(__dirname, '..', '..', '.jwt', 'public.key');
			const publicKey  = await fsPromise.readFile( publicKeyPath,'utf8');

			const payload  = jwt.verify(token, publicKey, verifyOptions) as { id: string };
			return await this.userRepository.findOne(payload.id) || false;
		} catch (e) {
			console.log(e);
			return false
		}

	};
}



