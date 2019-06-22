
const TYPES = {
	CheckoutHistoryService: Symbol.for("CheckoutHistoryRepository"),
	ItemStatusService: Symbol.for("ItemStatusRepository"),
	UserService: Symbol.for("UserRepository"),
	CatalogStatusService: Symbol.for("CatalogStatusService"),
	JWTService: Symbol.for("JWTService"),
	PaginatedService: Symbol.for("PaginatedService"),
};

export { TYPES };
