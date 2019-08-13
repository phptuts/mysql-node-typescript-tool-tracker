import { ExtendedRequest } from "./extend.request";

export interface FileRequest extends ExtendedRequest<void> {

	file: FileInterface;
}

export interface MultipleFileRequest extends ExtendedRequest<void> {

	file: FileInterface[];
}

export interface FileInterface {
	fieldName: string,
	originalname: string,
	encoding: string,
	mimetype: string,
	destination: string,
	filename: string,
	path: string
}
