import 'jest';
import dotenv  from 'dotenv';
import path from 'path';


beforeAll(() => {
	const testConfigPath = path.join(__dirname , '..','..', `.env-${process.env['ENVIRONMENT_NAME'] || 'test'}`);
	dotenv.config({ path:  testConfigPath });
});
