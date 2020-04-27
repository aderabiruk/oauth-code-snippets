import async from 'async';
import evalidate from 'evalidate';
import { Request, Response } from 'express';
import PasswordValidator from 'password-validator';

import { User } from '../models/User';
import UserService from '../services/User.service';
import { ERROR_MESSAGES } from '../errors/constants';
import { BadInputError, Error } from '../errors/errors';

class UserController {
    
    /**
     * Create User
     * 
     * @param {Request} request
     * @param {Response} response 
     */
    static create(request: Request, response: Response) {
        async.waterfall([
            (done: Function) => {
                let schema = new evalidate.schema({
                    email: evalidate.string().required("Email is required.").email(),
                    password: evalidate.string().required("Password is required")
                });
                let result = schema.validate(request.body);
                if (result.isValid) {
                    done(null);                    
                }
                else {
                    done(new BadInputError(result.errors));
                }
            },
            (done: Function) => {
                let schema = (new PasswordValidator())
                                .is().min(8)
                                .is().max(100)
                                .has().uppercase()
                                .has().lowercase()
                                .has().digits();
                
                if (schema.validate(request.body.password)) {
                    done(null);
                }
                else {
                    done(new BadInputError([
                        {field: "password", message: ERROR_MESSAGES.USER_PASSWORD_STRENGTH_ERROR }
                    ]));
                }
            },
            (done: Function) => {
                UserService.create(request.body.email, request.body.password)
                    .then((user: User) => {
                        response.status(200).json(user);
                    })
                    .catch((error: Error) => {
                        done(error);
                    });
            }
        ], (error: Error) => {
            if (error) {
                response.status(error.statusCode).json(error.payload);
            }
        });
    }

    /**
     * Find All Users
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static findAll(request: Request, response: Response) {
        UserService.findAll()
            .then((users: User[]) => {
                response.status(200).json(users);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find User By ID
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static findById(request: Request, response: Response) {
        UserService.findById(request.params.id)
            .then((user: User) => {
                response.status(200).json(user);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

}

export default UserController;