import _ from 'lodash';
import async from 'async';
import cryptoRandomString from 'crypto-random-string';

import { Client } from '../models/Client';
import ClientDAL from '../dals/Client.dal';
import { ERROR_MESSAGES } from '../errors/constants';
import { AuthorizationCode } from '../models/AuthorizationCode';
import AuthorizationCodeDAL from '../dals/AuthorizationCode.dal';
import { generateAccessTokenForClient } from '../utils/security';
import { NotFoundError, BadInputError, InternalServerError, UnauhtorizedError, ForbiddenError } from '../errors/errors';

class AuthService {

    /**
     * Client Authorization
     * 
     * @param {String} response_type OAuth Response Type
     * @param {String} client_id     Client ID
     * @param {String} redirect_uri  Redirect URI
     * @param {String} scope         Scope
     */
    static authorize(response_type: string, client_id: string, redirect_uri: string, scope: string): Promise<any> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    ClientDAL.findOne({ _id: client_id })
                        .then((client: Client) => {
                            if (client) {
                                done(null, client);
                            }
                            else {
                                done(new NotFoundError(ERROR_MESSAGES.CLIENT_NOT_FOUND_ERROR));
                            }
                        })
                        .catch((error: any) => {
                            done(new NotFoundError(error));
                        });
                },
                (client: Client, done: Function) => {
                    if (client.redirect_uri !== redirect_uri) {
                        done(new BadInputError([
                            { field: "redirect_uri", message: ERROR_MESSAGES.CLIENT_REDIRECT_URI_INVALID_ERROR }
                        ]));
                    }
                    else {
                        done(null, client);
                    }
                },
                (client: Client, done: Function) => {
                    let rscope = scope ? scope.split(" ") : [];
                    if (_.difference(rscope, client.scope).length > 0) {
                        done(new BadInputError([
                            { field: "redirect_uri", message: ERROR_MESSAGES.CLIENT_SCOPE_INVALID_ERROR }
                        ]));
                    }
                    else {
                        resolve({
                            client: client,
                            isAuthorized: true
                        });
                    }
                }
            ], (error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Client Approved
     * 
     * @param {String} client_id     Client ID
     * @param {String} redirect_uri  Redirect URI
     * @param {String} scope        Scope 
     */
    static approve(client_id: string, redirect_uri: string, scope: string): Promise<any> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    ClientDAL.findOne({ _id: client_id })
                        .then((client: Client) => {
                            if (client) {
                                done(null, client);
                            }
                            else {
                                done(new NotFoundError(ERROR_MESSAGES.CLIENT_NOT_FOUND_ERROR));
                            }
                        })
                        .catch((error: any) => {
                            done(new NotFoundError(error));
                        });
                },
                (client: Client, done: Function) => {
                    if (client.redirect_uri !== redirect_uri) {
                        done(new BadInputError([
                            { field: "redirect_uri", message: ERROR_MESSAGES.CLIENT_REDIRECT_URI_INVALID_ERROR }
                        ]));
                    }
                    else {
                        done(null, client);
                    }
                },
                (client: Client, done: Function) => {
                    let rscope = scope ? scope.split(" ") : [];
                    if (_.difference(rscope, client.scope).length > 0) {
                        done(new BadInputError([
                            { field: "redirect_uri", message: ERROR_MESSAGES.CLIENT_SCOPE_INVALID_ERROR }
                        ]));
                    }
                    else {
                        let code = cryptoRandomString({ length: 10 });
                        AuthorizationCodeDAL.create(client._id, code, scope)
                            .then((authroizationCode: AuthorizationCode) => {
                                resolve(authroizationCode);  
                            })
                            .catch((error: any) => {
                                done(new BadInputError(error));
                            })
                    }
                }
            ], (error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Generate Access Token
     * 
     * @param {string} client_id        Client ID
     * @param {string} client_secret    Client Secret
     * @param {string} code             Authorization Code
     * @param {string} redirect_uri     Redirect URI
     */
    static token(client_id: string, client_secret: string, code: string, redirect_uri: string): Promise<any> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    ClientDAL.findOne({ _id: client_id })
                        .then((client: Client) => {
                            if (client) {
                                done(null, client);
                            }
                            else {
                                done(new NotFoundError(ERROR_MESSAGES.CLIENT_NOT_FOUND_ERROR));
                            }
                        })
                        .catch((error: any) => {
                            done(new NotFoundError(error));
                        });
                },
                (client: Client, done: Function) => {
                    if (client.secret === client_secret) {
                        done(null, client);
                    }
                    else {
                        done(new NotFoundError(ERROR_MESSAGES.CLIENT_NOT_FOUND_ERROR));
                    }
                },
                (client: Client, done: Function) => {
                    AuthorizationCodeDAL.findOne({ code: code })
                        .then((authorizationCode: AuthorizationCode) => {
                            if (authorizationCode) {
                                done(null, client, authorizationCode);
                            }
                            else {
                                done(new ForbiddenError());
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (client: Client, authorizationCode: AuthorizationCode, done: Function) => {
                    resolve({
                        access_token: generateAccessTokenForClient(client, authorizationCode.scope, "30d"),
                        token_type: 'Bearer',
                        expires_in: 60 * 60 * 24 * 30,
                        refresh_token: '',
                        scope: authorizationCode.scope
                    });
                }
            ], (error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }
};

export default AuthService;