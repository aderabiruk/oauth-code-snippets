import express, { Router } from 'express';

import EmployeeController from '../controllers/Employee.controller';

let router: Router = express.Router();

router
    /**
     * Retrieve All Employees
     */
    .get("/", EmployeeController.findAll)
    /**
     * Retrieve Employee By ID
     */
    .get("/:id", EmployeeController.findById)
    /**
     * Register Employee
     */
    .post("/", EmployeeController.create);

export default router;