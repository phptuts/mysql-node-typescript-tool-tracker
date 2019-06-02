import { Container } from "inversify";
import { TYPES } from "./types";
import { interfaces as restinterfaces, TYPE } from "inversify-restify-utils";
import { CatalogController } from "../controller/catalog.controller";
import { EntityManager, getCustomRepository, getManager, getRepository, Repository } from "typeorm";
import { CatalogStatusRepository } from "../repository/catalog-status.repository";
import { ItemStatusRepository } from "../repository/item-status.repository";
import { User } from "../entity/user";
import { CheckoutHistory } from "../entity/checkout-history";
import { JWTService } from "../service/jwt.service";

const container = new Container({
	autoBindInjectable: true,
	defaultScope: "Singleton",
	skipBaseClassChecks: true
});

container.bind<restinterfaces.Controller>(TYPE.Controller)
	.to(CatalogController)
	.whenTargetNamed('CatalogController');

container
	.bind<EntityManager>(TYPES.EntityManager)
	.toDynamicValue( () => {
		return getManager();
	});

container
	.bind<CatalogStatusRepository>(TYPES.CatalogStatusRepository)
	.toDynamicValue( () => {
		return getCustomRepository(CatalogStatusRepository);
	});

container
	.bind<ItemStatusRepository>(TYPES.ItemStatusRepository)
	.toDynamicValue( () => {
		return getCustomRepository(ItemStatusRepository);
	});

container
	.bind<Repository<User>>(TYPES.UserRepository)
	.toDynamicValue( () => {
		return getRepository(User);
	});

container
	.bind<Repository<CheckoutHistory>>(TYPES.CheckoutHistoryRepository)
	.toDynamicValue(() => {
		return getRepository(CheckoutHistory);
	});


// container.bind<PaginateService>( TYPES.PaginatedService )
// 	.to(PaginateService)
// 	.inSingletonScope();
//
// container.bind<ItemService>( TYPES.ItemService )
// 	.to(ItemService)
// 	.inSingletonScope();
//
// container.bind<CatalogStatusService>( TYPES.CatalogStatusService )
// 	.to(CatalogStatusService)
// 	.inSingletonScope();

container.bind<JWTService>( TYPES.JWTService ).toDynamicValue(() => {
	return new JWTService(getRepository(User));
});

export { container };
