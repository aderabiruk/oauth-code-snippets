import config from 'config';
import express from 'express';

import AuthRouter from './Auth.router';
import ClientRouter from './Client.router';
import DashboardRouter from './Dashboard.router';
import JwtAuthenticationRouter from './JwtAuthentication.router';
import UserRouter from './User.router';

let version = config.get('version');

let routes = (app: express.Application) => {
    app.use(`/${version}/auth`, AuthRouter);
    app.use(`/${version}/client`, ClientRouter);
    app.use(`/${version}/dashboard`, DashboardRouter);
    app.use(`/${version}/jwt`, JwtAuthenticationRouter);
    app.use(`/${version}/user`, UserRouter);
};

export default routes;