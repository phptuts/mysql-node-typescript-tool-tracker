import 'jest';
import { LoginRequest } from "../model/request/login.request";
import { validateRequest } from "./validate.middleware";
import 'reflect-metadata';
import { Request, Response } from "restify";
import { ExtendedRequest } from "../model/request/extend.request";
import { FormError, MetaResponseModel, ResponseModel } from "../model/response/response.model";

describe( 'Validate MiddleWare', () => {

	let responseJsonSpy: jest.SpyInstance|any;
	let responseStatusSpy: jest.SpyInstance|any;
	let nextSpy: jest.SpyInstance|any;

	let req: Request|ExtendedRequest<LoginRequest>|any;

	let res: Response|any ;


	beforeEach(() => {

		req = {
			headers: {
				authorization: undefined
			},
			user: undefined
		};

		res = {
			json( body?: any, headers?: { [ p: string ]: string } ): any {
			},
			status( code: number ): number {
				return code;
			}
		};


		responseJsonSpy = jest.spyOn(res, 'json');
		responseStatusSpy = jest.spyOn(res, 'status');
		nextSpy = jasmine.createSpy('Next', () => {});
	});

	it ('test', () => {
		expect(true).toBeTruthy();
	});

	test ('it should call next and return nothing if no errors are found',
		 async ( ) => {

		req.body = { rfid: '32423423423' };

		const validator = validateRequest(LoginRequest);


		await validator(req, res, nextSpy);
		expect(nextSpy).toHaveBeenCalled();
		expect(req.validatedObject.rfid).toBe('32423423423');

	});

	it('it should return formatted errors if with default status', async () => {
		req.body = { rfid: '' };

		const validator = validateRequest(LoginRequest);
		await validator(req, res, nextSpy);


		 expect(responseStatusSpy).toHaveBeenCalledWith(400);
		 expect(responseJsonSpy).toHaveBeenCalled();

		 const response = responseJsonSpy.mock.calls[0][0] as ResponseModel<FormError[], MetaResponseModel>;


		expect(response.meta.type).toBe('form_errors');
		const formErrors = response.data as FormError[];
		expect(formErrors[0].property).toBe('rfid');
		expect(formErrors[0].messages['isAlphanumeric']).toBeDefined();
		expect(formErrors[0].messages['minLength']).toBeDefined();


	} );

	it ('should use a custom string for the error message', async () => {
		req.body = { rfid: '' };

		const validator = validateRequest(LoginRequest, 'error message', 401);
		await validator(req, res, nextSpy);

		expect(responseStatusSpy).toHaveBeenCalledWith(401);
		expect(responseJsonSpy).toHaveBeenCalled();

		const response = responseJsonSpy.mock.calls[0][0] as ResponseModel<FormError[], MetaResponseModel>;


		expect(response.meta.type).toBe('form_errors');
		expect(response.data).toBe('error message');

	});

} );
