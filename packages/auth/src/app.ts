import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';

import routes from './routers/index';
import { User } from './models/User';
import initializeDb from './utils/initializeDb';
import UserService from './services/User.service';
import { PassportLocalStrategy, PassportJWTStrategy } from './utils/security';


/**
 * Initialize Express App
 */
const app: Application = express();

/**
 * Passport Initialization
 */
app.use(passport.initialize());
app.use(passport.session());

passport.use(PassportLocalStrategy);
passport.use(PassportJWTStrategy);

passport.serializeUser((user: User, done: Function) => {
    done(null, user._id);
});

passport.deserializeUser((id: string, done: Function) => {
    UserService.findById(id)
        .then((user: User) => done(null, user))
        .catch((error: any) => done(error));        
});


/**
 * Middlewares
 */
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use('/public', express.static('public'));

/**
 * Initialize Pug Template Engine
 */
app.set('view engine', 'pug');

/**
 * Initialize Database
 */
initializeDb();

/**
 * Initialize Routes
 */
routes(app);

export default app;