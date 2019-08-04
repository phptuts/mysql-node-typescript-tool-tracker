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
import { CheckoutController } from "../controller/checkout.controller";
import { Item } from "../entity/item";
import { CheckoutService } from "../service/checkout.service";
import { ItemService } from "../service/entity/item.service";
import { ReturnController } from "../controller/return.controller";
import { ReturnService } from "../service/return.service";
import { UniqueFieldValidator } from "../validator/unique-field.validator";
import { RegisterController } from "../controller/admin/register.controller";


let container: Container;

export const createContainer = () => {

	container = new Container({
		autoBindInjectable: true,
		defaultScope: "Singleton",
		skipBaseClassChecks: true
	});

	container.bind<PaginateService>(TYPES.PaginatedService)
		.toService(PaginateService);

	container.bind<CheckoutService>(TYPES.CheckoutService).toDynamicValue(context => {
		return new CheckoutService(
			context.container.get(TYPES.CheckoutHistoryService),
			context.container.get(TYPES.ItemStatusService)
		)
	});

	container.bind<ReturnService>(TYPES.ReturnService).toDynamicValue(context => {
		return new ReturnService(
			context.container.get(TYPES.CheckoutHistoryService),
			context.container.get(TYPES.ItemService)
		)
	});

	container
		.bind<UniqueFieldValidator>(UniqueFieldValidator)
		.toService(UniqueFieldValidator);

	container
		.bind<CatalogStatusService>(TYPES.CatalogStatusService)
		.toDynamicValue( context => {
			const repository = getCustomRepository<CatalogStatusRepository>(CatalogStatusRepository, process.env.DB_CONNECTION_NAME);

			return new CatalogStatusService(context.container.get(TYPES.PaginatedService), repository);
		});

	container
		.bind<ItemStatusService>(TYPES.ItemStatusService)
		.toDynamicValue( () => {
			return new ItemStatusService(getRepository(ItemStatus, process.env.DB_CONNECTION_NAME));
		});

	container
		.bind<EntityService<User>>(TYPES.UserService)
		.toDynamicValue( () => {
			return new UserService(getRepository(User, process.env.DB_CONNECTION_NAME));
		});

	container
		.bind<ItemService>(TYPES.ItemService)
		.toDynamicValue( () => {
			return new ItemService(getRepository(Item, process.env.DB_CONNECTION_NAME));
		});

	container
		.bind<EntityService<CheckoutHistory>>(TYPES.CheckoutHistoryService)
		.toDynamicValue(() => {
			return new EntityService<CheckoutHistory>(getRepository(CheckoutHistory, process.env.DB_CONNECTION_NAME));
		});



	container.bind<JWTService>( TYPES.JWTService ).toDynamicValue(context => {

		return new JWTService(context.container.get(TYPES.UserService));
	});

	container
		.bind<restinterfaces.Controller>(TYPE.Controller)
		.to(CatalogController)
		.whenTargetNamed('CatalogController');

	container.bind<restinterfaces.Controller>(TYPE.Controller)
		.to(LoginController)
		.whenTargetNamed('LoginController');

	container.bind<restinterfaces.Controller>(TYPE.Controller)
		.to(CheckoutController)
		.whenTargetNamed('CheckoutController');

	container.bind<restinterfaces.Controller>(TYPE.Controller)
		.to(ReturnController)
		.whenTargetNamed('ReturnController');

	container.bind<restinterfaces.Controller>(TYPE.Controller)
		.to(RegisterController)
		.whenTargetNamed('RegisterController');


	return container;
};

export const getContainer = () => {
	if (!container) {
		return createContainer();
	}

	return container;
};
