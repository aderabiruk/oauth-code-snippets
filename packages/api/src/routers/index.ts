import config from 'config';
import express from 'express';

import EmployeeRouter from './Employee.router';

let version = config.get('version');

let routes = (app: express.Application) => {
    app.use(`/${version}/employee`, EmployeeRouter);
};

export default routes;