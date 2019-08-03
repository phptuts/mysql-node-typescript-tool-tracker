import { JWTService } from '../service/jwt.service';
import { User } from "../entity/user";
import dotenv  from 'dotenv';
import { getRepository } from "typeorm";
import { createContainer, getContainer } from "../container/container";
import { TYPES } from "../container/types";
import { dbConnection } from "../database/db";
import { useContainer } from "class-validator";
import { UserService } from "../service/entity/user.service";
dotenv.config();


async function printAndValidate(email: string) {
	try {
		await dbConnection;

		const userRepository = getRepository(User);

		const jwtService = createContainer().get<JWTService>(TYPES.JWTService);

		const jwtToken = await jwtService.generateJWTToken(
			await userRepository.findOne({ where: { email }})
		);

		const verifiedUser = await jwtService.verifyJWTToken(jwtToken.token);

		console.log(`JWT TOKEN: \n\n${jwtToken.token}\n\n`);
		console.log(`JWT IS USER ${JSON.stringify(verifiedUser)}`);

		return jwtToken;
	} catch (e) {
		console.error(e);
	}
}


printAndValidate('test-tool-checkout-service_1@gmail.com').then(async token => {
	useContainer(getContainer());

	const service = getContainer().get(TYPES.JWTService) as JWTService;

	console.log(await service.verifyJWTToken(token.token));

	process.exit(1);
});

