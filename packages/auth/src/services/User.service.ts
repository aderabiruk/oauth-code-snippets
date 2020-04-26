import async from 'async';
import config from 'config';

import { User }  from '../models/User';
import UserDAL from "../dals/User.dal";
import { hash } from '../utils/security';
import { ERROR_MESSAGES } from '../errors/constants';
import { BadInputError, InternalServerError, NotFoundError } from '../errors/errors';

class UserService {

    /**
     * Create User
     * 
     * @param {String} email
     * @param {String} password 
     */
    static create(email: String, password: String): Promise<any> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    hash(password.toString(), config.get("security.hash.saltRound"))
                        .then((hash) => {
                            done(null, hash);
                        })
                        .catch((error) => {
                            done(new BadInputError([ error ]));
                        });
                },
                (hash: String, done: Function) => {
                    UserDAL.create(email, hash)
                        .then((user: User) => {
                            resolve(user);
                        })
                        .catch((error) => {
                            done(new BadInputError(error));
                        });
                }
            ], (error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Find All Users
     */
    static findAll(): Promise<any> {
        return new Promise((resolve, reject) => {
            UserDAL.findMany({})
                .then((users: User[]) => {
                    resolve(users);
                })
                .catch((error: any) => {
                    reject(new InternalServerError(error));
                });
        });
    }

    /**
     * Find User By Id
     * 
     * @param {String} id
     */
    static findById(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            UserDAL.findOne({ _id: id })
                .then((user: User) => {
                    if (user) {
                        resolve(user);
                    }
                    else {
                        reject(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND_ERROR));
                    }
                    
                })
                .catch((error: any) => {
                    reject(new NotFoundError(error));
                });
        });
    }
};

export default UserService;