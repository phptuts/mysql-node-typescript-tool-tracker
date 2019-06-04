import { Catalog } from "./catalog";
import { User } from "./user";
import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('item')
export class Item {

	@PrimaryColumn({ type: 'uuid' })
	@Generated("uuid")
	id: string;

	@Column({type: "varchar", unique: true, nullable: false, name: 'rfid'})
	rfid: string;

	@ManyToOne(type => Catalog)
	@JoinColumn({ name: 'catalog_id', referencedColumnName: 'id' })
	catalog: Catalog;

	@ManyToOne(type => User)
	@JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
	createdBy: User;

	@Column({ type: 'boolean', nullable: false, default: false, name: 'damaged' })
	damaged: boolean;
}
