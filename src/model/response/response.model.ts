export interface MetaResponseModel {
	type: string
}

export enum ResponseTypes {
	FORM_ERRORS = 'form_errors',
	NOT_FOUND = 'not_found',
	ACCESS_DENIED = 'access_denied',
	AUTH_TOKEN = 'auth_token',
	BAD_REQUEST = 'bad_request',
	REGISTER_USER = 'register_user'
}

export interface PaginatedMetaModel extends MetaResponseModel {
	currentPage: number,
	pageSize: number,
	numberOfPages: number,
	lastPage: boolean,
}

export interface FormError {
	property: string;

	messages: { [ key: string ]: string }
}

export interface ResponseModel<T, M extends MetaResponseModel> {
	meta: M,
	data: T | T[]
}

export const createResponse = <T>( data: T, responseType: ResponseTypes ): ResponseModel<T, MetaResponseModel> => {
	return {
		meta: {
			type: responseType
		},
		data
	}
};
