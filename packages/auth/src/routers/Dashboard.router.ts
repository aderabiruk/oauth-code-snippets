import express, { Router } from 'express';

import { authenticate } from '../middlewares/CookieAuthenticate';
import DashboardController from '../controllers/Dashboard.controller';

let router: Router = express.Router();

router
    /**
     * Home
     */
    .get("/", authenticate, DashboardController.home)
    /**
     * Clients
     */
    .get('/clients', authenticate, DashboardController.clients)
    /**
     * Users
     */
    .get('/users', authenticate, DashboardController.users);

export default router;