
export interface MetaResponseModel {
	type: string
}

export interface PaginatedMetaModel extends MetaResponseModel{
	currentPage: number,
	pageSize: number,
	numberOfPages: number,
	lastPage: boolean,
}

export interface ResponseModel<T, M extends MetaResponseModel> {
	meta: M,
	data: T|T[]
}
