import axios from 'axios';
import config from 'config';
import evalidate from 'evalidate';
import queryString from 'query-string';
import { Request, Response } from 'express';
import cryptoRandomString from 'crypto-random-string';

import { client as RedisClient } from '../utils/initializeRedis';
import { encodeBasicAuthenticationHeader } from '../utils/security';

class AuthController {
    
    /**
     * Authorize
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static authorize(request: Request, response: Response) {
        let code = cryptoRandomString({ length: 10 });

        RedisClient.set("state", code);

        let query = queryString.stringify({
            state: code,
            response_type: "code",
            scope: config.get("sso.client.scope"),
            client_id: config.get("sso.client.client_id"),
            redirect_uri: config.get("sso.client.redirect_uri")
        });

        response.redirect(`${config.get("sso.server.authorization_url")}?${query}`);
    }

    /**
     * Callback
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static callback(request: Request, response: Response) {
        const Schema = new evalidate.schema({
            code: evalidate.string().required("Authorization code is required."),
            state: evalidate.string().required("State is required."),
        });

        let result = Schema.validate(request.query);
        if (result.isValid) {
            RedisClient.get("state", (error, state) => {
                if (error) {
                    return response.render("errors/internal_server_error", {
                        title: "Internal Error",
                        error: error
                    });
                }
                else if (state !== request.query.state) {
                    return response.render("errors/unauthorized", {
                        title: "Unauthorized",
                        error: "Invalid State"
                    });
                }
                else {
                    RedisClient.del("state");
                    
                    let body = {
                        grant_type: "authorization_code",
                        code: request.query.code,
                        redirect_uri: config.get("sso.client.redirect_uri")
                    };
                    let configuration = {
                        headers: {
                            'Authorization': `Basic ${encodeBasicAuthenticationHeader(config.get("sso.client.client_id"), config.get("sso.client.client_secret"))}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                    axios.post(config.get("sso.server.token_url"), queryString.stringify(body), configuration)
                        .then((result) => {
                            RedisClient.set("access_token", result.data.access_token);
                            RedisClient.set("refresh_token", result.data.refresh_token);

                            response.render("success/success", {
                                title: "Authentication Successful",
                                message: "You have successfully authenticated"
                            });
                        })
                        .catch((error) => {
                            return response.render("errors/internal_server_error", {
                                title: "Internal Error",
                                error: error
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
}

export default AuthController;