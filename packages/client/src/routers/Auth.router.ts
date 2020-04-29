import express, { Router } from 'express';

import AuthController from '../controllers/Auth.controller';

let router: Router = express.Router();

router
    /**
     * Authorize Endpoint
     */
    .get("/authorize", AuthController.authorize)
    /**
     * Callback Endpoint
     */
    .get("/callback", AuthController.callback)
    /**
     * Dasboard
     */
    .get("/dashboard", AuthController.dashboard);

export default router;