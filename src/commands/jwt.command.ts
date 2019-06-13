import { JWTService } from '../service/jwt.service';
import { User } from "../entity/user";
import dotenv  from 'dotenv';
import { getRepository } from "typeorm";
import { createContainer } from "../container/container";
import { TYPES } from "../container/types";
import { dbConnection } from "../database/db";
dotenv.config();


async function printAndValidate(email: string) {
	try {
		await dbConnection;

		const userRepository = getRepository(User);

		const jwtService = createContainer().get<JWTService>(TYPES.JWTService);

		const jwtToken = await jwtService.generateJWTToken(
			await userRepository.findOne({ where: { email }})
		);

		const verifiedUser = await jwtService.verifyJWTToken(jwtToken);

		console.log(`JWT TOKEN: \n\n${jwtToken}\n\n`);
		console.log(`JWT IS USER ${JSON.stringify(verifiedUser)}`);

	} catch (e) {
		console.error(e);
	}
}

printAndValidate('test-tool-checkout-service_1@gmail.com').then();
