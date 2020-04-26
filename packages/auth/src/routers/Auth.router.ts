import passport from 'passport';
import express, { Router } from 'express';

import AuthController from '../controllers/Auth.controller';

let router: Router = express.Router();

router
    /**
     * Authorization Endpoint
     */
    .get("/authorize", AuthController.authorize)
    /**
     * Approve Endpoint
     */
    .post("/approve", AuthController.approve)
    /**
     * Login Endpoint
     */
    .post("/login", AuthController.authenticate)
    /**
     * Token Endpoint
     */
    .post("/token", AuthController.token)
    /**
     * Verify Token
     */
    .get("/verifyJwtToken", passport.authenticate('jwt', { session: false }), AuthController.verifyJwtToken);

export default router;