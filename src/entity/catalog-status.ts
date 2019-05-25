import { ViewColumn, ViewEntity } from "typeorm";


@ViewEntity({
	name: 'catalog-status',
	expression: `SELECT cat.id as 'catalogId', ANY_VALUE(cat.name) as 'name', ANY_VALUE(description) as 'description',
COUNT(item.id) as 'numberOfItems',
SUM(CASE WHEN ch.return_date is NULL and ch.checkout_date is not null THEN 1 ELSE 0 END) as 'numberOfItemCheckedOut',
SUM(CASE WHEN ch.return_date is NULL and ch.checkout_date is not null THEN 0 ELSE 1 END) as 'numberOfItemAvailable'
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

	@ViewColumn()
	catalogId: string;

	@ViewColumn()
	name: string;

	@ViewColumn()
	numberOfItems: number;

	@ViewColumn()
	numberOfItemAvailable: number;

	@ViewColumn()
	numberOfItemCheckedOut: number;
}
