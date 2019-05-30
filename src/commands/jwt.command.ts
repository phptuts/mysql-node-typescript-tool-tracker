import { JWTService } from '../service/jwt.service';
import { User } from "../entity/user";
import dotenv  from 'dotenv';
import { getRepository } from "typeorm";
import { createTestConnection } from "../test/create-test-connection";
dotenv.config();



const user = new User();
user.rfid = 'rfid-tag';
user.email = 'gal@gamil.com';
user.roles = ['ROLE_USER'];
user.enabled = true;
user.imageUrl = 'fake-image';
user.password = 'fake-password';




async function printAndValidate() {
	try {

		const connection = await createTestConnection();

		const userRepository = getRepository(User);


		const jwtService = new JWTService(userRepository);


		console.log(connection.isConnected, 'connected db');

		await userRepository.save(user);

		const jwtToken = await jwtService.generateJWTToken(user);

		const verifiedUser = await jwtService.verifyJWTToken(jwtToken);

		console.log(`JWT TOKEN: \n\n${jwtToken}\n\n`);
		console.log(`JWT IS USER ${JSON.stringify(verifiedUser)}`);

	} catch (e) {
		console.error(e);
	}
}

printAndValidate().then();
