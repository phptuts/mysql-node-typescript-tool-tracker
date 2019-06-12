import { PaginatedMetaModel, ResponseModel } from "../model/response/response.model";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PaginateService {

	public createResponse<T>(
		items: T[],
		numberOfResults: number,
		currentPage: number,
		pageSize: number,
		type: string
	): ResponseModel<T[], PaginatedMetaModel> {

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

