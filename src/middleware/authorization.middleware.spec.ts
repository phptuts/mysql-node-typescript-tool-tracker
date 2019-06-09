import 'jest';
import { container } from "../container/container";
import { JWTService } from "../service/jwt.service";
import { User } from "../entity/user";
import { Request, Response, Next } from 'restify';
import { authUser } from "./authenticate.middleware";

describe('Authorization Middleware', () => {

	let containerSpy: jest.SpyInstance;
	let jwtServiceSpy: jest.SpyInstance;
	let responseSpy: jest.SpyInstance|any;

	let jwtService: JWTService|any;

	const req: Request|any = {
		headers: {
			authorization: undefined
		}
	};

	const res: Response|any = {
		send( code?: number, body?: any, headers?: { [ p: string ]: string } ): any {
		}
	};

	const next: Next|any = () => {};

	beforeEach(() => {
		containerSpy = jest.spyOn(container, 'get');
		jwtService = {
			verifyJWTToken( token: string ): Promise<false | User> {
				return Promise.resolve(undefined);
			}
		};
		jwtServiceSpy = jest.spyOn(jwtService, 'verifyJWTToken');
		responseSpy = jest.spyOn(res, 'send');
	});

	it('should 401 no authorization string in header', async () => {


		await authUser(req, res, next);
		expect(responseSpy).toHaveBeenCalledWith(401, 'Authentication Required');
	});

	// it ('it should 403 if the no user id is found with jwt token', async () => {
	//
	// });
	//
	// it ('it should attach the user to the request and call next if successful', async () => {
	//
	// });

});
