import { FileInterface } from "../model/request/file.request";
import md5 from 'blueimp-md5' ;
const mime =  require('mime');
import { FILE_TYPE, FILE_PATHS } from "../file";
import { User } from "../entity/user";
import path from 'path';
import fs from 'fs';
import { injectable } from "inversify";
import { Catalog } from "../entity/catalog";

@injectable()
export class FileService {

	public uploadUserPhoto(user: User, file: FileInterface) {
		const fileName = `${md5(user.id)}.${mime.extension(file.mimetype)}`;

		const newFilePath = path.join(FILE_PATHS[FILE_TYPE.USER], fileName);

		fs.renameSync(file.path, newFilePath);

		return '/images/user/' + fileName;
	}

	public uploadCatalogPhotos(catalog: Catalog) {

	}
}
