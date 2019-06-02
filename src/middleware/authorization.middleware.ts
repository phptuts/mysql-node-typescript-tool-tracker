import { Next, Request, Response } from "restify";
import { User } from "../entity/user";

/**
 * Requires that a user has a certain role to continue
 */
export const hasRole = (role: string) =>  {
	return  (req: Request|any|{user: User}, res: Response, next: Next) => {
		if (!req.user) {
			res.send(403, 'Permission Denied.');
			return;
		}

		if (!req.user.roles.includes(role)) {
			res.send(403, 'Permission Denied.');
			return;
		}

		next();
	}
};
