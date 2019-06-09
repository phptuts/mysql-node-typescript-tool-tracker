import { createConnection, Loader, Resolver, Builder, Parser, fixturesIterator } from 'typeorm-fixtures-cli';
import * as path from 'path';
import { Connection, getRepository } from 'typeorm';

export class LoadTestFixtures {
	constructor() {}

	async loadFiles(filePaths: string[], connection: Connection) {

		const loader = new Loader();
		filePaths.forEach((fixturePath: string) => {
			loader.load(path.resolve(fixturePath));
		});
		const resolver = new Resolver();
		const fixtures = resolver.resolve(loader.fixtureConfigs);
		const builder = new Builder(connection, new Parser());

		for (const fixture of fixturesIterator(fixtures)) {
			const entity = await builder.build(fixture);
			await getRepository(entity.constructor.name, connection.name).save(entity);
		}
	}
}
