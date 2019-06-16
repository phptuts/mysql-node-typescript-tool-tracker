import { generateKeyPair } from 'crypto';
import utils from 'util'
import fs from 'fs';
import path from 'path';

utils.promisify(generateKeyPair);



generateKeyPair('rsa', {
	modulusLength: 4096,
	publicKeyEncoding: {
		type: 'spki',
		format: 'pem'
	},
	privateKeyEncoding: {
		type: 'pkcs8',
		format: 'pem',
		cipher: 'aes-256-cbc',
		passphrase: ''
	}
}, (err, publicKey, privateKey) => {
	if (!fs.existsSync((path.join(__dirname,'..', '..', '.jwt')))) {
		fs.mkdirSync(path.join(__dirname,'..', '..', '.jwt'));
	}
	fs.writeFileSync(
		path.join(__dirname,'..', '..', '.jwt', 'private.key'), privateKey);
	fs.writeFileSync(path.join(__dirname,'..', '..', '.jwt', 'public.key'), publicKey);
});
