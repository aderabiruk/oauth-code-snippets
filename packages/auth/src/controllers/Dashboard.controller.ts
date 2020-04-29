import async from 'async';
import moment from 'moment';
import { Request, Response } from 'express';

import { User } from '../models/User';
import { Error } from '../errors/errors';
import { Client } from '../models/Client';
import UserService from '../services/User.service';
import ClientService from '../services/Client.service';

class DashboardController {

    /**
     * Dashboard
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static home(request: Request, response: Response) {
        let user: any = request.user;

        async.waterfall([
            (done: Function) => {
                ClientService.findAll()
                    .then((clients: Client[]) => {
                        done(null, clients.length);
                    })
                    .catch((error: Error) => {
                        done(error);
                    });
            },
            (client_count: number, done: Function) => {
                UserService.findAll()
                    .then((users: User[]) => {
                        done(null, client_count, users.length);
                    })
                    .catch((error: Error) => {
                        done(error);
                    });

                
            },
            (client_count: number, user_count: number, done: Function) => {
                return response.render("dashboard/home", {
                    title: "Dashboard",
                    email: user.email,
                    client_count: client_count,
                    user_count: user_count
                });
            }
        ], (error) => {
            if (error) {
                return response.render("errors/internal_server_error", {
                    title: "Internal Error",
                    error: "Something went wrong!"
                });
            }
        });
        
    }

    /**
     * Clients
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static clients(request: Request, response: Response) {
        let user: any = request.user;

        ClientService.findAll()
            .then((clients: Client[]) => {
                return response.render("dashboard/clients", {
                    title: "Clients",
                    email: user.email,
                    clients: clients
                });
            })
            .catch((error: Error) => {
                return response.render("errors/internal_server_error", {
                    title: "Internal Error",
                    error: "Something went wrong!"
                });
            });
    }

    /**
     * Users
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static users(request: Request, response: Response) {
        let user: any = request.user;

        UserService.findAll()
            .then((users: User[]) => {
                users.map((user) => ({ ...user, createdAt: moment(user.created_at).format("YYYY-MM-DD")}));
                return response.render("dashboard/users", {
                    title: "Users",
                    email: user.email,
                    users: users
                });
            })
            .catch((error: Error) => {
                return response.render("errors/internal_server_error", {
                    title: "Internal Error",
                    error: "Something went wrong!"
                });
            });
    }
}

export default DashboardController;