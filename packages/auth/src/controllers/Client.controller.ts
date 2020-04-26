
import evalidate from 'evalidate';
import { Request, Response } from 'express';

import { Error, BadInputError } from '../errors/errors';
import { Client } from '../models/Client';
import ClientService from '../services/Client.service';

class ClientController {
    
    /**
     * Create Client
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static create(request: Request, response: Response) {
        let schema = new evalidate.schema({
            name: evalidate.string().required("Client name is required.").minlength(3).maxlength(10),
            redirect_uri: evalidate.string().required("Redirect Uri is required."),
            scopes: evalidate.array().required("Scopes is required.")
        });
    
        let result = schema.validate(request.body)
        if (result.isValid) {
            ClientService.create(request.body.name, request.body.redirect_uri, request.body.scopes)
                .then((client: Client) => {
                    response.json(client);
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
     * Find All Clients
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static findAll(request: Request, response: Response) {
        ClientService.findAll()
            .then((clients: Client[]) => {
                response.status(200).json(clients);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find Client By ID
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static findById(request: Request, response: Response) {
        ClientService.findById(request.params.id)
            .then((client: Client) => {
                response.status(200).json(client);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }
}

export default ClientController;