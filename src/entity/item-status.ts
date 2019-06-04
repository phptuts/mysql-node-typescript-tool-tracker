
import { PrimaryColumn, ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
	name: 'item_status',
	expression: `SELECT cat.id as 'catalogId', cat.name as 'name', cat.description as 'description',
 item.id as 'itemId',  item.rfid as 'rfid',
 (ch.return_date is NULL and ch.checkout_date is not null) as 'isCheckedOut',
 ch.id as 'checkoutHistoryId',
 ch.checkout_date as 'itemCheckoutDate', 
 ch.return_date as 'itemReturnDate',
 ch.note,
 item.damaged,
 uc.id as 'userIdCheckout', uc.email as 'userEmailCheckout',
 ur.id as 'userIdReturn', ur.email as 'userEmailReturn'
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
 LEFT JOIN user uc on  ch.user_id_checking_out_item = uc.id
 LEFT JOIN user ur on  ch.user_id_returning_item = ur.id`
})
export class ItemStatus {

	@ViewColumn()
	@PrimaryColumn()
	itemId: string;

	@ViewColumn()
	catalogId: string;

	@ViewColumn()
	name: string;

	@ViewColumn()
	description: string;

	@ViewColumn()
	isCheckedOut: boolean;

	@ViewColumn()
	rfid: string;

	@ViewColumn()
	checkoutHistoryId?: string;

	@ViewColumn()
	itemCheckoutDate?: Date;

	@ViewColumn()
	itemReturnDate?: Date;

	@ViewColumn()
	userIdCheckout?: string;

	@ViewColumn()
	userEmailCheckout?: string;

	@ViewColumn()
	userIdReturn?: string;

	@ViewColumn()
	userEmailReturn?: string;

	@ViewColumn()
	damaged: boolean;

	@ViewColumn()
	note: string;

}
