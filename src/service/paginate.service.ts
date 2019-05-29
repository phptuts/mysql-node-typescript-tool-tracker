import { PaginatedMetaModel, ResponseModel } from "../model/response/response.model";

export const createPaginatedResponse =  <T>(
	items: T[],
	numberOfResults: number,
	currentPage: number,
	pageSize: number,
	type: string
): ResponseModel<T[], PaginatedMetaModel> => {

	const numberOfPages = Math.ceil(numberOfResults / pageSize);
	const lastPage = numberOfPages  === currentPage;

	return {
		data: items,
		meta: {
			pageSize,
			currentPage,
			lastPage,
			type,
			numberOfPages
		}
	}
}
