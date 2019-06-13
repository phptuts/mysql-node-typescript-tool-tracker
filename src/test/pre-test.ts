import 'jest';
import dotenv  from 'dotenv';
import path from 'path';


beforeAll(() => {
	console.log('this should run');
	const testConfigPath = path.join(__dirname , '..','..', '.env-test');
	dotenv.config({ path:  testConfigPath });
});
