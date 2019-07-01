import { IsAlphanumeric,  MinLength } from "class-validator";
import 'reflect-metadata';

export class LoginRequest {

	@MinLength(5)
	@IsAlphanumeric()
	public rfid: string;

}

