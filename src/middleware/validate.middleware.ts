import { Next, Response } from "restify";
import { ValidationError } from "class-validator";
import { ExtendedRequest } from "../model/request/extend.request";
import { ClassType, transformAndValidate } from "class-transformer-validator";
import { FormError, MetaResponseModel, ResponseModel, ResponseTypes } from "../model/response/response.model";


export const validateRequest = <T extends object>(
	classType: ClassType<T>,
	defaultErrorMessage?: string,
	statusCode = 400,
	responseType = ResponseTypes.FORM_ERRORS) => {

	return async (req: ExtendedRequest<T>, res: Response, next: Next) => {

		try {
			req.validatedObject =
				await transformAndValidate(classType, req.body) as T;
			console.log(req.validatedObject, 'validated object');
			next();
			return;

		} catch (e) {
			if (!Array.isArray(e)) {
				throw e;
			}

			res.status(statusCode);
			const response: ResponseModel<FormError[]|string, MetaResponseModel> = {
				meta: {
					type: responseType
				},
				data: defaultErrorMessage || formatErrors(e)
		     };

			res.json(response);
			return;
		}

	}

};

const formatErrors = (validationError: ValidationError[]): FormError[] => {

	return validationError.map(validationError => {
		return {
			property: validationError.property,
			messages: validationError.constraints
		}
	})

};
