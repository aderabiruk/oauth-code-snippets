import passport from 'passport';
import express, { Router } from 'express';

import JwtAuthenticationController from '../controllers/JwtAuthentication.controller';

let router: Router = express.Router();

router
    /**
     * JWT Login Endpoint
     */
    .post("/login", JwtAuthenticationController.login)
    /**
     * Verify JWT Token
     */
    .get("/verifyJwtToken", passport.authenticate('jwt', { session: false }), JwtAuthenticationController.verifyJwtToken);

export default router;