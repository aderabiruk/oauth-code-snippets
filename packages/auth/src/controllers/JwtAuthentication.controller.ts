import passport from 'passport';
import { Request, Response } from 'express';

import { generateAccessToken } from '../utils/security';
import { ERROR_STATUS_CODES } from '../errors/constants';
import { InternalServerError, UnauhtorizedError } from '../errors/errors';

class JwtAuthenticationController {
    
    /**
     * JWT User Authentication
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static login(request: Request, response: Response) {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error) {
                return response.status(ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR).json((new InternalServerError(error.message)).payload);
            }
            else if (!user) {
                return response.status(ERROR_STATUS_CODES.UNAUTHORIZED_ERROR).json((new UnauhtorizedError()).payload);
            }
            else {
                request.logIn(user, { session: false }, (error) => {
                    if (error) {
                        return response.status(ERROR_STATUS_CODES.UNAUTHORIZED_ERROR).json((new UnauhtorizedError()).payload);
                    }
                    else {
                        const token = generateAccessToken(user, "30d");
                        return response.status(200).json({
                            _id: user._id,
                            email: user.email,
                            token: token
                        });
                    }
                });
            }
        })(request, response);
    }

    /**
     * Verify JWT Token
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static verifyJwtToken(request: Request, response: Response) {
        response.json({"isValid": true, "user": request.user});
    }

}

export default JwtAuthenticationController;