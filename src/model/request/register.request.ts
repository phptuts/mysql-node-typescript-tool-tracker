import { IsArray, IsEmail, IsEnum, Validate } from "class-validator";
import { UniqueFieldValidator } from "../../validator/unique-field.validator";
import { ROLES, User } from "../../entity/user";


export class RegisterRequest {

	@Validate(UniqueFieldValidator, ['rfid', User], {
		message: 'RFID must be unique'
	})
	public rfid: string;

	@IsEmail()
	@Validate(UniqueFieldValidator, ['email', User], {
		message: 'Email must be unique'
	})
	public email: string;

	public phone: string;

	@IsArray()
	@IsEnum(ROLES, { each: true } )
	public roles: ROLES[];
}
