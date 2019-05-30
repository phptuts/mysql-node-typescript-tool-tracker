import { Container } from "inversify";
import { TYPES } from "./types";
import { CatalogStatusService } from "../service/catalog-status.service";
import { ItemService } from "../service/item.service";
import { JWTService } from "../service/jwt.service";
import { interfaces as restinterfaces, TYPE } from "inversify-restify-utils";
import { CatalogController } from "../controller/catalog.controller";
import { EntityManager, getManager } from "typeorm";
import { PaginateService } from "../service/paginate.service";

const container = new Container();

container.bind<restinterfaces.Controller>(TYPE.Controller).to(CatalogController).whenTargetNamed('CatalogController');

container
	.bind<EntityManager>(TYPES.EntityManager)
	.toDynamicValue( () => {
		return getManager();
	});

container.bind<PaginateService>( TYPES.PaginatedService ).to(PaginateService);
container.bind<ItemService>( TYPES.ItemService ).to(ItemService);
container.bind<CatalogStatusService>( TYPES.CatalogStatusService ).to(CatalogStatusService);
container.bind<JWTService>( TYPES.JWTService ).to(JWTService);

export { container };
