import { Request, Response } from "express";

import { decodeAccessToken } from '../utils/security';

/**
 * Cookie Authentication Middleware
 * 
 * @param {Request} request 
 * @param {Respone} response 
 * @param {Function} next 
 */
export const authenticate = (request: Request, response: Response, next: Function) => {
    const token = request.cookies.token || null;
    if (token) {
        const payload = decodeAccessToken(token);
        request.user = payload;
        next();
    }
    else {
        return response.redirect("/v1/auth/login");
    }
};