import 'jest';
import { JWTService } from "./jwt.service";
import { ObjectID, Repository } from "typeorm";
import { User } from "../entity/user";

describe('JWT Service', () => {

	let service: JWTService;

	let userRepository: any|Repository<User>;

	let userRepositorySpy: jest.SpyInstance;

	beforeEach(() => {
		userRepository = {
			findOne( id: string): Promise<User|undefined> {
				return Promise.resolve(undefined);
			}
		};

		userRepositorySpy = jest.spyOn(userRepository, 'findOne');
		service = new JWTService(userRepository);
	});

	it ('should be able generate a valid jwt token and verify it', async () => {
		const user = new User();
		user.id = 'fake_user_id';

		userRepositorySpy.mockImplementation(() => user);
		const token = await service.generateJWTToken(user);
		const retrievedUser = await service.verifyJWTToken(token);

		expect(retrievedUser).toBe(user);
		expect(userRepositorySpy).toHaveBeenCalledWith('fake_user_id');
	});

	it ('should return false if a user can not be found', async () => {
		const user = new User();
		user.id = 'fake_user_id';

		userRepositorySpy.mockImplementation(() => undefined);
		const token = await service.generateJWTToken(user);
		const retrievedUser = await service.verifyJWTToken(token);

		expect(retrievedUser).toBeFalsy();
		expect(userRepositorySpy).toHaveBeenCalledWith('fake_user_id');

	})

});
