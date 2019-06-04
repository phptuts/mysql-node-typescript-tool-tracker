import { AfterLoad, PrimaryColumn, ViewColumn, ViewEntity } from "typeorm";


@ViewEntity({
	name: 'catalog-status',
	expression: `SELECT cat.id as 'catalogId', ANY_VALUE(cat.name) as 'name', ANY_VALUE(description) as 'description',
COUNT(item.id) as 'numberOfItems',
SUM(CASE WHEN (ch.return_date is NULL and ch.checkout_date is not null) THEN 1 ELSE 0 END) as 'numberOfItemCheckedOut',
SUM(item.damaged) as 'numberOfItemsDamaged',
COUNT(item.id) - SUM(CASE WHEN (ch.return_date is NULL and ch.checkout_date is not null) THEN 1 ELSE 0 END) - SUM(item.damaged)  as 'numberOfItemAvailable'
 FROM checkout_history ch
 INNER JOIN
 (
 SELECT \`item_id\`, MAX(checkout_date) AS checkout_date_max
 FROM checkout_history
 GROUP BY \`item_id\`
 ) cch
 ON cch.\`item_id\` = ch.\`item_id\` AND cch.checkout_date_max = ch.checkout_date
 RIGHT JOIN item on ch.item_id = item.id
 INNER JOIN catalog cat on item.catalog_id = cat.id
GROUP BY cat.id`
})
export class CatalogStatus {

	public static readonly TYPE = 'CATALOG_STATUS';

	@ViewColumn()
	@PrimaryColumn()
	catalogId: string;

	@ViewColumn()
	name: string;

	@ViewColumn()
	description: string;

	@ViewColumn()
	numberOfItems: number;

	@ViewColumn()
	numberOfItemCheckedOut: number;

	@ViewColumn()
	numberOfItemsDamaged: number;

	@ViewColumn()
	numberOfItemAvailable: number;

	canCheckout: boolean;

	@AfterLoad()
	afterLoad() {
		this.canCheckout = this.numberOfItems > 0;
	}
}
