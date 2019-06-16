import { Container } from "inversify";
import { TYPES } from "./types";
import { interfaces as restinterfaces, TYPE } from "inversify-restify-utils";
import { CatalogController } from "../controller/catalog.controller";
import { getCustomRepository, getManager, getRepository, Repository } from "typeorm";
import { CatalogStatusRepository } from "../repository/catalog-status.repository";
import { User } from "../entity/user";
import { CheckoutHistory } from "../entity/checkout-history";
import { JWTService } from "../service/jwt.service";
import { LoginController } from "../controller/login.controller";
import { UserService } from "../service/entity/user.service";
import { ItemStatusService } from "../service/entity/item-status.service";
import { ItemStatus } from "../entity/item-status";

let container: Container;

export const createContainer = (databaseConnectionName = "default") => {

	container = new Container({
		autoBindInjectable: true,
		defaultScope: "Singleton",
		skipBaseClassChecks: true
	});

	container
		.bind<CatalogStatusRepository>(TYPES.CatalogStatusRepository)
		.toDynamicValue( () => {
			return getCustomRepository(CatalogStatusRepository, databaseConnectionName);
		});

	container
		.bind<ItemStatusService>(TYPES.ItemStatusRepository)
		.toDynamicValue( () => {
			return new ItemStatusService(getRepository(ItemStatus));
		});

	container
		.bind<Repository<User>>(TYPES.UserRepository)
		.toDynamicValue( () => {
			console.log('in here');
			return getRepository(User, databaseConnectionName);
		});

	container
		.bind<Repository<CheckoutHistory>>(TYPES.CheckoutHistoryRepository)
		.toDynamicValue(() => {
			return getRepository(CheckoutHistory, databaseConnectionName);
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
