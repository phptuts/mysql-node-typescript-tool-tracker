const multer = require('multer');
import path from 'path';

export const upload = multer({
	dest: path.join('/', 'tmp'),
	fileFilter: (req, file, cb) => {
		// Basic check to make sure image a valid mimetype
		cb(null, ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].includes(file.mimetype));

	} });

const userFileUploadPath = path.join(__dirname , '..', 'public', 'images', 'user');

export enum FILE_TYPE  {
	USER = 'USER'
}

export const  FILE_PATHS = {
	[FILE_TYPE.USER]: userFileUploadPath
};
