import _ from 'lodash';
import async from 'async';

import { Client } from '../models/Client';
import ClientDAL from '../dals/Client.dal';
import { ERROR_MESSAGES } from '../errors/constants';
import { NotFoundError, BadInputError } from '../errors/errors';

class AuthService {

    /**
     * Client Authorization
     * 
     * @param response_type OAuth Response Type
     * @param client_id     Client ID
     * @param redirect_uri  Redirect URI
     * @param scopes        Scopes
     */
    static authorize(response_type: string, client_id: string, redirect_uri: string, scopes: string): Promise<any> {
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
                    let rscope = scopes ? scopes.split(" ") : [];
                    if (_.difference(rscope, client.scopes).length > 0) {
                        done(new BadInputError([
                            { field: "redirect_uri", message: ERROR_MESSAGES.CLIENT_SCOPE_INVALID_ERROR }
                        ]));
                    }
                    else {
                        resolve({
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

    static approve(): Promise<any> {
        return new Promise((resolve, reject) => {

        });
    }

    static token(): Promise<any> {
        return new Promise((resolve, reject) => {

        });
    }
};

export default AuthService;