import {  Response, Next } from 'restify';
import { getContainer } from "../container/container";
import { TYPES } from "../container/types";
import { JWTService } from "../service/jwt.service";
import { ExtendedRequest } from "../model/request/extend-request";

/**
 * Requires that a user must send a valid jwt token attached to the user
 */
export const authUser = async (req: ExtendedRequest<void>, res: Response, next: Next) => {

	const jwtToken = req.headers.authorization ?  req.headers.authorization.replace('Bearer ', '') : false;

	if (!jwtToken) {
		res.send(401, 'Authentication Required');
		return;
	}


	const jwtService = getContainer().get<JWTService>(TYPES.JWTService);
	const user = await jwtService.verifyJWTToken(jwtToken);

	if (!user) {
		res.send(403, 'Invalid Authentication Token');
		return;
	}

	req.user = user;
	next();
};


