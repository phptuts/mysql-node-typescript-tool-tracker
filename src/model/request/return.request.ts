
import { IsBoolean } from "class-validator";

export class ReturnRequest {

	@IsBoolean()
	public damaged: boolean;


	public notes = '';

}
