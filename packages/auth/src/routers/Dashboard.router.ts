import express, { Router } from 'express';

import { authenticate } from '../middlewares/CookieAuthenticate';
import DashboardController from '../controllers/Dashboard.controller';

let router: Router = express.Router();

router
    /**
     * Home
     */
    .get("/", authenticate, DashboardController.home);

export default router;