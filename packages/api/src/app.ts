import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from "body-parser";
import compression from 'compression';
import express, { Application } from 'express';

import routes from '../src/routers';
import initializeDb from './utils/initializeDb';

/**
 * Initialize Express App
 */
const app: Application = express();

/**
 * Middlewares
 */
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));

/**
 * Initialize Database
 */
initializeDb();

/**
 * Initialize Routes
 */
routes(app);

export default app;