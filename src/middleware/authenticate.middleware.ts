import { Request, Response, Next } from 'restify';
import { container } from "../container/container";
import { TYPES } from "../container/types";
import { JWTService } from "../service/jwt.service";
import { User } from "../entity/user";

/**
 * Requires that a user must send a valid jwt token attached to the user
 */
export const authUser = async (req: Request|any, res: Response, next: Next) => {

	const jwtToken = req.headers.authorization.replace('Bearer ', '');

	if (!jwtToken) {
		res.send(401, 'Authentication Required');
		return;
	}

	const jwtService = container.get<JWTService>(TYPES.JWTService);
	const user = await jwtService.verifyJWTToken(jwtToken);
	console.log(user);
	if (!user) {
		res.send(403, 'Invalid Authentication Token');
		return;
	}

	req.user = user;
	next();
};


