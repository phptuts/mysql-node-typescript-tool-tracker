
const TYPES = {
	CheckoutHistoryService: Symbol.for("CheckoutHistoryRepository"),
	ItemStatusService: Symbol.for("ItemStatusRepository"),
	UserService: Symbol.for("UserRepository"),
	CatalogStatusService: Symbol.for("CatalogStatusService"),
	ItemService: Symbol.for("ItemService"),
	JWTService: Symbol.for("JWTService"),
	PaginatedService: Symbol.for("PaginatedService"),
	EntityManager: Symbol.for("EntityManager")
};

export { TYPES };
