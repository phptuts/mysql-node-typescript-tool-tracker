import { Next, Request, Response } from "restify";
import { User } from "../entity/user";

/**
 * Requires that a user has a certain role to continue
 */
export const hasRole = (role: string) =>  {
	return  (req: Request|any|{user: User}, res: Response, next: Next) => {
		if (req.user instanceof User && req.user.roles.includes(role)) {
			next();
			return;
		}

		res.send(403, 'Permission Denied.');
		return;
	}
};
