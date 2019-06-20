import 'jest';
import { JWTService } from "./jwt.service";
import { User } from "../entity/user";
import { EntityService } from "./entity/entity.service";

describe('JWT Service', () => {

	let service: JWTService;

	let userService: any|EntityService<User>;

	let userServiceFindByIdSpy: jest.SpyInstance;

	beforeEach(() => {
		userService = {
			findById( id: string): Promise<User|undefined> {
				return Promise.resolve(undefined);
			}
		};

		userServiceFindByIdSpy = jest.spyOn(userService, 'findById');
		service = new JWTService(userService);
	});

	it ('should be able generate a valid jwt token and verify it', async () => {
		const user = new User();
		user.id = 'fake_user_id';
		user.roles = [];
		const expectedDate = Math.floor(Date.now() / 1000) + 10 * 60;
		userServiceFindByIdSpy.mockImplementation(() => user);
		const response = await service.generateJWTToken(user);
		const retrievedUser = await service.verifyJWTToken(response.token);

		expect(retrievedUser).toBe(user);
		expect(response.expirationTimestamp).toBeGreaterThanOrEqual(expectedDate);
		expect(userServiceFindByIdSpy).toHaveBeenCalledWith('fake_user_id');
	});

	it ('should let an admin user login for 30 seconds', async () => {
		const user = new User();
		user.id = 'fake_user_id';
		user.roles = ['ROLE_ADMIN'];
		const expectedDate = Math.floor(Date.now() / 1000) + 30 * 60;

		userServiceFindByIdSpy.mockImplementation(() => user);
		const response = await service.generateJWTToken(user);
		const retrievedUser = await service.verifyJWTToken(response.token);

		expect(retrievedUser).toBe(user);
		expect(response.expirationTimestamp).toBeGreaterThanOrEqual(expectedDate);
		expect(userServiceFindByIdSpy).toHaveBeenCalledWith('fake_user_id');

	});

	it ('should return false if a user can not be found', async () => {
		const user = new User();
		user.id = 'fake_user_id';
		user.roles = [];

		userServiceFindByIdSpy.mockImplementation(() => undefined);
		const response = await service.generateJWTToken(user);
		const retrievedUser = await service.verifyJWTToken(response.token);

		expect(retrievedUser).toBeFalsy();
		expect(userServiceFindByIdSpy).toHaveBeenCalledWith('fake_user_id');

	})

});
