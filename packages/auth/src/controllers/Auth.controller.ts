import moment from 'moment';
import passport from 'passport';
import evalidate from 'evalidate';
import queryString from 'query-string';
import { Request, Response } from 'express';

import AuthService from '../services/Auth.service';
import { AuthorizationCode } from '../models/AuthorizationCode';
import { ERROR_MESSAGES, ERROR_STATUS_CODES } from '../errors/constants';
import { BadInputError, Error, UnauhtorizedError } from '../errors/errors';
import { generateAccessToken, decodeBasicAuthenticationHeader } from '../utils/security';

const QueryParamsValidationSchema = new evalidate.schema({
    response_type: evalidate.string().required("Response Type is required.").equals("code", "Invalid response type provided."),
    client_id: evalidate.string().required("Client Id is required."),
    redirect_uri: evalidate.string().required("Redirect Uri is required."),
    state: evalidate.string().required("State is required."),
    scope: evalidate.string().required("Scope is required")
});

class AuthController {
    
    /**
     * Approve Client
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static approve(request: Request, response: Response) {
        const query = request.session.authorization_query;
        if (!query) {
            return response.render("errors/unauthorized", {
                title: "Unauthorized",
                error: ERROR_MESSAGES.FORBIDDEN_ERROR
            });
        }

        let result = QueryParamsValidationSchema.validate(query)
        if (result.isValid) {
            request.session.destroy((error) => {
                if (error) {
                    return response.render("errors/unauthorized", {
                        title: "Unauthorized",
                        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
                    });
                }
                else {
                    AuthService.approve(query.client_id, query.redirect_uri, query.scope)
                        .then((authorizationCode: AuthorizationCode) => {
                            let queryParams = queryString.stringify({
                                code: authorizationCode.code,
                                state: query.state
                            });
                            response.redirect(`${query.redirect_uri}?${queryParams}`);
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
                                title: "Unauthorized",
                                error: errorMessage
                            });
                        });
                }
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
        let user: any = request.user;
        let result = QueryParamsValidationSchema.validate(request.query)
        if (result.isValid) {
            AuthService.authorize(request.query.response_type.toString(), request.query.client_id.toString(), request.query.redirect_uri.toString(), request.query.scope.toString())
                .then((status: any) => {
                    if (status.isAuthorized) {
                        request.session.authorization_query = request.query;
                        return response.render("auth/conscent", {
                            title: "Authorize",
                            email: user.email,
                            client: status.client,
                            scope: request.query.scope.toString().split(" ")
                        });
                    }
                    else {
                        return response.render("errors/unauthorized", {
                            title: "Unauthorized",
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
                        title: "Unauthorized",
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
        let authorization = decodeBasicAuthenticationHeader(request.headers["authorization"]);
        if (authorization && authorization.client_id && authorization.client_secret) {

            const Schema = new evalidate.schema({
                grant_type: evalidate.string().required("Grant Type is required.").in(["authorization_code", "refresh_token"], "Invalid grant type provided."),
                code: evalidate.string().required("Authorization code is required."),
                redirect_uri: evalidate.string().required("Redirect Uri is required.")
            });

            let result = Schema.validate(request.body);
            if (result.isValid) {
                AuthService.token(authorization.client_id, authorization.client_secret, request.body.code, request.body.redirect_uri)
                    .then((result) => {
                        response.status(200).json(result);
                    })
                    .catch((error: Error) => {
                        return response.status(error.statusCode).json(error.payload);
                    });
            }
            else {
                return response.status(ERROR_STATUS_CODES.BAD_INPUT_ERROR).json(new BadInputError(result.errors).payload);
            }
        }
        else {
            return response.status(ERROR_STATUS_CODES.UNAUTHORIZED_ERROR).json((new UnauhtorizedError()).payload);
        }
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