import { Request, Response } from "express";

import { ForbiddenError } from "../errors/errors";
import { decodeAccessToken } from '../utils/security';
import { ERROR_STATUS_CODES } from "../errors/constants";

/**
 * JWT Authentication Middleware
 * 
 * @param {Request} request 
 * @param {Respone} response 
 * @param {Function} next 
 */
export const authenticate = (request: Request, response: Response, next: Function) => {
    const token = request.headers["authorization"] ? request.headers["authorization"].split(" ")[1] : "";
    if (token) {
        const payload = decodeAccessToken(token);
        next();
    }
    else {
        return response.status(ERROR_STATUS_CODES.UNAUTHORIZED_ERROR).json(new ForbiddenError().payload);
    }
};