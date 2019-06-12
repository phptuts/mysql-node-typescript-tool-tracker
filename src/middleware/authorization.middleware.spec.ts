import 'jest';
import { Next, Request, Response } from "restify";
import { User } from "../entity/user";
import { hasRole } from "./authorization.middleware";

describe('Authorization Middleware', () => {

	let responseSpy: jest.SpyInstance|any;
	let nextSpy: jest.SpyInstance|any;

	let req: Request|any;

	let res: Response|any ;


	beforeEach(() => {

		req = {
			headers: {
				authorization: undefined
			},
			user: undefined
		};

		res = {
			send( code?: number, body?: any, headers?: { [ p: string ]: string } ): any {
			}
		};


		responseSpy = jest.spyOn(res, 'send');
		nextSpy = jasmine.createSpy('Next', () => {});
	});

	it('should return 403 if user is not present in request object', async () => {
		await hasRole('ROLE_USER')(req, res, nextSpy);
		expect(responseSpy).toHaveBeenCalledWith(403, 'Permission Denied.');
		expect(nextSpy).not.toHaveBeenCalled();
	});

	it ('should return 403 if user does not have the right role', async () => {
		req.user = new User();
		req.user.roles = ['ROLE_USER'];
		await hasRole('ROLE_ADMIN')(req, res, nextSpy);
		expect(responseSpy).toHaveBeenCalledWith(403, 'Permission Denied.');
		expect(nextSpy).not.toHaveBeenCalled();
	});

	it ('should call next if user has right role', async () => {
		req.user = new User();
		req.user.roles = ['ROLE_ADMIN'];
		await hasRole('ROLE_ADMIN')(req, res, nextSpy);
		expect(responseSpy).not.toHaveBeenCalled();
		expect(nextSpy).toHaveBeenCalled();
	});

});
