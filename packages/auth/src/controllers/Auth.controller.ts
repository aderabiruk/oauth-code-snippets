import moment from 'moment';
import passport from 'passport';
import evalidate from 'evalidate';
import { Request, Response } from 'express';

import AuthService from '../services/Auth.service';
import { generateAccessToken } from '../utils/security';
import { ERROR_MESSAGES, ERROR_STATUS_CODES } from '../errors/constants';
import { BadInputError, InternalServerError, Error, UnauhtorizedError } from '../errors/errors';

class AuthController {
    
    /**
     * Approve Client
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static approve(request: Request, response: Response) {
        response.json({"status": "approve"});
    }

    /**
     * Authenticate User
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static authenticate(request: Request, response: Response) {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error) {
                return response.render("auth/login", {
                    email: request.body.email,
                    error: error.message
                });
            }
            else if (!user) {
                return response.render("auth/login", {
                    email: request.body.email,
                    error: ERROR_MESSAGES.AUTHENTICATION_ERROR
                });
            }
            else {
                request.logIn(user, { session: false }, (error) => {
                    if (error) {
                        return response.render("auth/login", {
                            email: request.body.email,
                            error: ERROR_MESSAGES.AUTHENTICATION_ERROR
                        });
                    }
                    else {
                        const token = generateAccessToken(user, "30d");
                        response.cookie('token', token, {
                            httpOnly: true,
                            expires: moment().add(7, 'days').toDate(),
                            secure: false
                        });

                        const redirect_uri = request.session.redirect_uri || "/v1/dashboard";
                        return response.redirect(redirect_uri);
                    }
                });
            }
        })(request, response);
    }

    /**
     * Authorize Client
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static authorize(request: Request, response: Response) {
        let schema = new evalidate.schema({
            response_type: evalidate.string().required("Response Type is required.").equals("code", "Invalid response type provided."),
            client_id: evalidate.string().required("Client Id is required."),
            redirect_uri: evalidate.string().required("Redirect Uri is required."),
            state: evalidate.string().required("State is required."),
            scopes: evalidate.string().required("Scopes are required")
        });
    
        let result = schema.validate(request.query)
        if (result.isValid) {
            AuthService.authorize(request.query.response_type.toString(), request.query.client_id.toString(), request.query.redirect_uri.toString(), request.query.scopes.toString())
                .then((status: any) => {
                    if (status.isAuthorized) {
                        return response.render("auth/approve", {
    
                        });
                    }
                    else {
                        return response.render("errors/unauthorized", {
                            error: ERROR_MESSAGES.FORBIDDEN_ERROR
                        });
                    }
                })
                .catch((error: Error) => {
                    let errorMessage: String;
                    if (error instanceof BadInputError) {
                        errorMessage = error.payload.errors[0].message;
                    }
                    else {
                        errorMessage = error.payload.errors[0];
                    }
                    return response.render("errors/unauthorized", {
                        error: errorMessage
                    });
                });
        }
        else {
            return response.render("errors/unauthorized", {
                title: "Unauthorized",
                error: result.errors[0].message
            });
        }
    }

    /**
     * Render Login Page
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static login(request: Request, response: Response) {
        return response.render("auth/login", { });
    }

    /**
     * Logout
     * 
     * @param request 
     * @param response 
     */
    static logout(request: Request, response: Response) {
        response.clearCookie("token")
        return response.render("auth/login", { });
    }

    /**
     * Retrieve Access Token
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static token(request: Request, response: Response) {
        response.json({"status": "token"});
    }

    /**
     * Verify JWT Access Token from Cookie
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static verifyCookieJwtAccessToken(request: Request, response: Response) {
        response.json({"status": "token"});
    }

}

export default AuthController;