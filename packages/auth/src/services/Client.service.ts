import cryptoRandomString from 'crypto-random-string';

import { Client}  from '../models/Client';
import ClientDAL from "../dals/Client.dal";
import { ERROR_MESSAGES } from '../errors/constants';
import { BadInputError, InternalServerError, NotFoundError } from '../errors/errors';

export class ClientService {

    /**
     * Create Client
     * 
     * @param {String}  name            Client name
     * @param {String}  redirect_uri    Redirect Uri for Client
     * @param {Array}   scope          Client Scope
     */
    static create(name: String, redirect_uri: String, scope: String[]): Promise<any> {
        return new Promise((resolve, reject) => {
            let secret = cryptoRandomString({ length: 10 });
            ClientDAL.create(name, secret, redirect_uri, scope)
                .then((client: Client) => {
                    resolve(client);
                })
                .catch((error: any) => {
                    reject(new BadInputError(error));
                });
        });
    }

    /**
     * Find All Clients
     */
    static findAll(): Promise<any> {
        return new Promise((resolve, reject) => {
            ClientDAL.findMany({})
                .then((clients: Client[]) => {
                    resolve(clients);
                })
                .catch((error: any) => {
                    reject(new InternalServerError(error));
                });
        });
    }

    /**
     * Find Client By Id
     * 
     * @param {String} id Client Id
     */
    static findById(id: String): Promise<any> {
        return new Promise((resolve, reject) => {
            ClientDAL.findOne({ _id: id })
                .then((client: Client) => {
                    if (client) {
                        resolve(client);
                    }
                    else {
                        reject(new NotFoundError(ERROR_MESSAGES.CLIENT_NOT_FOUND_ERROR));
                    }
                    
                })
                .catch((error: any) => {
                    reject(new NotFoundError(error));
                });
        });
    }
};

export default ClientService;