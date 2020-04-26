import express, { Router } from 'express';

import ClientController from '../controllers/Client.controller';

let router: Router = express.Router();

router
    /**
     * Retrieve All Clients
     */
    .get("/", ClientController.findAll)
    /**
     * Retrieve Client By ID
     */
    .get("/:id", ClientController.findById)
    /**
     * Register Client
     */
    .post("/", ClientController.create);

export default router;