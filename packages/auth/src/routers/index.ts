import config from 'config';
import express from 'express';

import AuthRouter from './Auth.router';
import ClientRouter from './Client.router';
import UserRouter from './User.router';

let version = config.get('version');

let routes = (app: express.Application) => {
    app.use(`/${version}/auth`, AuthRouter);
    app.use(`/${version}/client`, ClientRouter);
    app.use(`/${version}/user`, UserRouter);
};

export default routes;