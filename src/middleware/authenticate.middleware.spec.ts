import 'jest';
import * as container from "../container/container";
import { JWTService } from "../service/jwt.service";
import { User } from "../entity/user";
import { Request, Response, Next } from 'restify';
import { authUser } from "./authenticate.middleware";
import { TYPES } from "../container/types";

describe('Authentication Middleware', () => {

	let containerSpy: jest.SpyInstance;
	let jwtServiceSpy: jest.SpyInstance;
	let responseSpy: jest.SpyInstance|any;
	let nextSpy: jest.SpyInstance|any;

	let jwtService: JWTService|any;

	const next: Next|any = () => {};

	let req: Request|any;

	let res: Response|any ;


	beforeEach(() => {

		req = {
			headers: {
				authorization: undefined
			}
		};

		res = {
			send( code?: number, body?: any, headers?: { [ p: string ]: string } ): any {
			}
		};

		jwtService = {
			verifyJWTToken( token: string ): Promise<false | User> {
				return Promise.resolve(undefined);
			}
		};

		containerSpy = jest.spyOn(container, 'getContainer');
		containerSpy.mockImplementation(() => {
			return {
				get(type: Symbol) {
					if (TYPES.JWTService) {
						return jwtService;
					}
				}
			}
		});

		jwtServiceSpy = jest.spyOn(jwtService, 'verifyJWTToken');
		responseSpy = jest.spyOn(res, 'send');
		nextSpy = jasmine.createSpy('Next', () => {});
	});

	it('should 401 no authorization string in header', async () => {

		await authUser(req, res, next);
		expect(responseSpy).toHaveBeenCalledWith(401, 'Authentication Required');
	});

	it ('it should 403 if the no user id is found with jwt token', async () => {

		req.headers.authorization = 'Bearer jwt_token';

		jwtServiceSpy.mockImplementation(() => Promise.resolve(undefined));

		await authUser(req, res, next);

		expect(responseSpy).toHaveBeenCalledWith(403, 'Invalid Authentication Token');
		expect(jwtServiceSpy).toHaveBeenCalledWith('jwt_token');

	});

	it ('it should attach the user to the request and call next if successful', async () => {
		req.headers.authorization = 'Bearer jwt_token';

		const user = new User();

		jwtServiceSpy.mockImplementation(() => Promise.resolve(user));

		await authUser(req, res, nextSpy);
		expect(nextSpy).toHaveBeenCalledTimes(1);
		expect(req.user).toBe(user);
	});

});
