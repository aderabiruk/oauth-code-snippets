import express, { Router } from 'express';

import UserController from '../controllers/User.controller';

let router: Router = express.Router();

router
    /**
     * Retrieve All Users
     */
    .get("/", UserController.findAll)
    /**
     * Retrieve User By ID
     */
    .get("/:id", UserController.findById)
    /**
     * Register User
     */
    .post("/", UserController.create);

export default router;