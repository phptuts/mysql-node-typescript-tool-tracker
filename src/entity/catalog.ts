import { User } from "./user";
import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('catalog')
export class Catalog {

	@PrimaryColumn({ type: 'uuid' })
	@Generated("uuid")
	id: string;

	@Column({ type: 'varchar', name: 'name' })
	name: string;

	@Column({ type: "text", nullable: true, name: 'description' })
	description: string;

	@Column({ type: "varchar", nullable: true, name: 'image_url' })
	imageUrl: string;

	@ManyToOne(type => User)
	@JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
	createdBy: User;
	
}
