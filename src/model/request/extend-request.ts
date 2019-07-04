
import { Request as RestifyRequest } from "restify";
import { User } from "../../entity/user";

export interface ExtendedRequest<T> extends RestifyRequest {

	validatedObject?: T;

	user: User;

}
