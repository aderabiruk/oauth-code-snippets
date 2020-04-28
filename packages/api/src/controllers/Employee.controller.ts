
import evalidate from 'evalidate';
import { Request, Response } from 'express';

import { Employee } from '../models/Employee';
import { Error, BadInputError } from '../errors/errors';
import EmployeeService from '../services/Employee.service';

class EmployeeController {
    
    /**
     * Create Employee
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static create(request: Request, response: Response) {
        let schema = new evalidate.schema({
            first_name: evalidate.string().required("First name is required."),
            last_name: evalidate.string().required("Last name is required."),
            email: evalidate.string().required("Email is required."),
            salary: evalidate.number().required("Salary is required."),
        });
    
        let result = schema.validate(request.body)
        if (result.isValid) {
            EmployeeService.create(request.body.first_name, request.body.last_name, request.body.email, request.body.salary)
                .then((employee: Employee) => {
                    response.json(employee);
                })
                .catch((error: Error) => {
                    response.status(error.statusCode).json(error.payload);
                });
        }
        else {
            response.status(400).json(new BadInputError(result.errors).payload);
        }
    }

    /**
     * Find All Employees
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static findAll(request: Request, response: Response) {
        EmployeeService.findAll()
            .then((employees: Employee[]) => {
                response.status(200).json(employees);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find Employee By ID
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static findById(request: Request, response: Response) {
        EmployeeService.findById(request.params.id)
            .then((employee: Employee) => {
                response.status(200).json(employee);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }
}

export default EmployeeController;