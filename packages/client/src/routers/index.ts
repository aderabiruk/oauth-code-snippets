import config from 'config';
import express from 'express';

import AuthRouter from './Auth.router';

let version = config.get('version');

let routes = (app: express.Application) => {
    app.use(`/${version}/auth`, AuthRouter);
};

export default routes;