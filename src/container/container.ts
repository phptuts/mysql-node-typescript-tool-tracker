import { Container } from "inversify";
import { TYPES } from "./types";
import { interfaces as restinterfaces, TYPE } from "inversify-restify-utils";
import { CatalogController } from "../controller/catalog.controller";
import { getCustomRepository, getRepository } from "typeorm";
import { CatalogStatusRepository } from "../repository/catalog-status.repository";
import { User } from "../entity/user";
import { CheckoutHistory } from "../entity/checkout-history";
import { JWTService } from "../service/jwt.service";
import { LoginController } from "../controller/login.controller";
import { UserService } from "../service/entity/user.service";
import { ItemStatusService } from "../service/entity/item-status.service";
import { ItemStatus } from "../entity/item-status";
import { EntityService } from "../service/entity/entity.service";
import { CatalogStatusService } from "../service/entity/catalog-status.service";
import { PaginateService } from "../service/paginate.service";
import { CatalogStatus } from "../entity/catalog-status";


let container: Container;

export const createContainer = (databaseConnectionName = "default") => {

	container = new Container({
		autoBindInjectable: true,
		defaultScope: "Singleton",
		skipBaseClassChecks: true
	});

	container
		.bind<CatalogStatusService>(TYPES.CatalogStatusService)
		.toDynamicValue( () => {

			console.log('this was called');
			const repository = getCustomRepository<CatalogStatusRepository>(CatalogStatusRepository, databaseConnectionName);

			return new CatalogStatusService(new PaginateService(), repository);
		});

	container
		.bind<ItemStatusService>(TYPES.ItemStatusService)
		.toDynamicValue( () => {
			return new ItemStatusService(getRepository(ItemStatus));
		});

	container
		.bind<EntityService<User>>(TYPES.UserService)
		.toDynamicValue( () => {
			return new UserService(getRepository(User, databaseConnectionName));
		});

	container
		.bind<EntityService<CheckoutHistory>>(TYPES.CheckoutHistoryService)
		.toDynamicValue(() => {
			return new EntityService<CheckoutHistory>(getRepository(CheckoutHistory, databaseConnectionName));
		});


	container.bind<JWTService>( TYPES.JWTService ).toDynamicValue(() => {
		return new JWTService(new UserService(getRepository(User, databaseConnectionName)));
	});

	container
		.bind<restinterfaces.Controller>(TYPE.Controller)
		.to(CatalogController)
		.whenTargetNamed('CatalogController');

	container.bind<restinterfaces.Controller>(TYPE.Controller)
		.to(LoginController)
		.whenTargetNamed('LoginController');



	return container;
};

export const getContainer = () => {
	if (!container) {
		return createContainer();
	}

	return container;
};
