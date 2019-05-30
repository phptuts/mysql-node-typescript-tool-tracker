import { PaginatedMetaModel, ResponseModel } from "../model/response/response.model";
import { injectable } from "inversify";

@injectable()
export class PaginateService {

	public createResponse<T>(
		items: T[],
		numberOfResults: number,
		currentPage: number,
		pageSize: number,
		type: string
	): ResponseModel<T[], PaginatedMetaModel> {

		console.log((items), 'items');

		console.log(JSON.stringify(items), 'items');
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
}

