import { Length, Min } from "class-validator";

export class LoginRequest {

	@Length(5, 30)
	public readonly rfid: string;

	constructor(rfid: string) {
		this.rfid = rfid;
	}
}
