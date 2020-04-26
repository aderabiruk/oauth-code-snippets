import evalidate from 'evalidate';
import { Request, Response } from 'express';

import { User } from '../models/User';
import UserService from '../services/User.service';
import { BadInputError, Error } from '../errors/errors';

class UserController {
    
    /**
     * Create User
     * 
     * @param {Request} request
     * @param {Response} response 
     */
    static create(request: Request, response: Response) {
        let schema = new evalidate.schema({
            email: evalidate.string().required("Email is required.").email(),
            password: evalidate.string().required("Password is required")
        });

        let result = schema.validate(request.body);
        if (result.isValid) {
            UserService.create(request.body.email, request.body.password)
                .then((user: User) => {
                    response.status(200).json(user);
                })
                .catch((error: Error) => {
                    response.status(error.statusCode).json(error.payload);
                });
        }
        else {
            response.status(400).json(new BadInputError(result.errors).payload);
        }
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