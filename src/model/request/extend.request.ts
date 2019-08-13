
import { Request as RestifyRequest } from "restify";
import { User } from "../../entity/user";
import 'reflect-metadata';

export interface ExtendedRequest<T> extends RestifyRequest {

	validatedObject?: T;

	user: User;


}



