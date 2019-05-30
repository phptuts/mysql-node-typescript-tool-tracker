import { Container } from "inversify";
import { TYPES } from "./types";
import { CatalogStatusService } from "../service/catalog-status.service";
import { ItemService } from "../service/item.service";
import { JWTService } from "../service/jwt.service";

const container = new Container();

container.bind<ItemService>( TYPES.ItemService ).to(ItemService);
container.bind<CatalogStatusService>( TYPES.CatalogStatusService ).to(CatalogStatusService);
container.bind<JWTService>( TYPES.JWTService ).to(JWTService);

export { container };
