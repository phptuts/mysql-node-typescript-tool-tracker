import { Next, Response } from "restify";
import { ROLES, User } from "../entity/user";
import { ExtendedRequest } from "../model/request/extend.request";

/**
 * Requires that a user has a certain role to continue
 */
export const hasRole = (role: ROLES) =>  {
	return  (req: ExtendedRequest<void>, res: Response, next: Next) => {
		if (req.user instanceof User &&
			req.user.enabled &&
			req.user.roles.includes(role)) {
			next();
			return;
		}

		res.send(403, 'Permission Denied.');
		return;
	}
};
