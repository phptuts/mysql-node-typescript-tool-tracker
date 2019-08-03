import { injectable } from "inversify";
import { Controller, Post } from "inversify-restify-utils";
import { authUser } from "../middleware/authenticate.middleware";
import { hasRole } from "../middleware/authorization.middleware";


export class UserController {


	@Post("/admin/user")
	public async register() {

	}
}
