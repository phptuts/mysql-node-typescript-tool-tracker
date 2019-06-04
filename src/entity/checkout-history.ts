import { User } from "./user";
import { Item } from "./item";
import { Column, Entity, Generated, IsNull, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity({
	name: 'checkout_history',
	synchronize: true,
	orderBy: {
		checkoutDate: "DESC",
		returnDate: "DESC"
	}
})
export class CheckoutHistory {

	@PrimaryColumn({ type: 'uuid' })
	@Generated("uuid")
	public id;

	@ManyToOne(type => Item)
	@JoinColumn({ name: 'item_id', referencedColumnName: 'id' })
	public item: Item;

	@Column({ type: 'datetime', name: 'checkout_date' })
	public checkoutDate: Date;

	@ManyToOne(type => User, null, { nullable: false })
	@JoinColumn({ name: 'user_id_checking_out_item', referencedColumnName: 'id' })
	public userCheckoutItem: User;

	@Column({type: 'datetime', nullable: true, name: 'return_date'})
	public returnDate: Date;

	@ManyToOne(type => User, null, { nullable: true })
	@JoinColumn({ name: 'user_id_returning_item', referencedColumnName: 'id' })
	public userReturningItem: User;


	@Column({ type: 'boolean', nullable: true, name: 'damaged' })
	public damaged: boolean;

	@Column({ type: 'text', nullable: true, name: 'note' })
	public note: string;

	public isCheckedOut(): boolean {
		return this.returnDate == undefined || this.userReturningItem == undefined;
	}
}
