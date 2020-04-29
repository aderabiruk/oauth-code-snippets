import express, { Router } from 'express';

import { authenticate } from '../middlewares/Authenticate';
import EmployeeController from '../controllers/Employee.controller';

let router: Router = express.Router();

router
    /**
     * Retrieve All Employees
     */
    .get("/", authenticate, EmployeeController.findAll)
    /**
     * Retrieve Employee By ID
     */
    .get("/:id", authenticate, EmployeeController.findById)
    /**
     * Register Employee
     */
    .post("/", authenticate, EmployeeController.create);

export default router;