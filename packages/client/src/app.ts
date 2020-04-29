import cors from 'cors';
import redis from 'redis';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import express, { Application } from 'express';

import routes from './routers/index';
import initializeRedis from './utils/initializeRedis';

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
app.use(morgan('combined'));
app.use('/public', express.static('public'));

/**
 * Initialize Pug Template Engine
 */
app.set('view engine', 'pug');

/**
 * Initialize Redis
 */
initializeRedis();

/**
 * Initialize Routes
 */
routes(app);

export default app;