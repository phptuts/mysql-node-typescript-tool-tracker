import { Column, Entity, Generated, PrimaryColumn } from "typeorm";

@Entity('user')
export class User {
	
	@PrimaryColumn({ type: 'uuid' })
	@Generated("uuid")
	id: string;

	@Column({type: 'varchar', nullable: false, unique: true, name: 'email' })
	email: string;

	@Column({ type: 'varchar', nullable: false, name: 'password' })
	password: string;

	@Column({ type: 'varchar', nullable: true, name: 'image_url'})
	imageUrl: string;

	@Column({ type: 'boolean', nullable: false, default: true, name: 'enabled' })
	enabled: boolean;

	@Column({ type: 'boolean', nullable: false, default: true, name: 'block_checkout' })
	blockCheckout: boolean;

	@Column({ type: 'varchar', nullable: false, name: 'rfid' })
	rfid: string;

	@Column({ type: 'text', nullable: false, name: 'roles', transformer: {
			to( value: any|string ): any|string {
				return value.join(',');
			},

			from( value: any|string ): any|[] {
				return value.split(',');
			}
		} })
	roles: string[];
}