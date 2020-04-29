import passport from 'passport';
import express, { Router } from 'express';

import AuthController from '../controllers/Auth.controller';
import { authenticate } from '../middlewares/CookieAuthenticate';

let router: Router = express.Router();

router
    /**
     * Authorization Endpoint
     */
    .get("/authorize", authenticate, AuthController.authorize)
    /**
     * Approve Endpoint
     */
    .post("/approve", authenticate, AuthController.approve)
    /**
     * Login Endpoint
     */
    .get("/login", AuthController.login)
    /**
     * Login Endpoint
     */
    .post("/login", AuthController.authenticate)
    /**
     * Logout Endpoint
     */
    .get("/logout", AuthController.logout)
    /**
     * Token Endpoint
     */
    .post("/token", AuthController.token)
    /**
     * Verify Token
     */
    .get("/verify", authenticate, AuthController.verifyCookieJwtAccessToken);

export default router;