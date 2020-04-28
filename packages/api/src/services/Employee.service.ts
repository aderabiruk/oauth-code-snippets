import { Employee }  from '../models/Employee';
import EmployeeDAL from "../dals/Employee.dal";
import { ERROR_MESSAGES } from '../errors/constants';
import { BadInputError, InternalServerError, NotFoundError } from '../errors/errors';

export class EmployeeService {

    /**
     * Create Employee
     * 
     * @param {string} first_name   Employee First Name
     * @param {string} last_name    Employee Last Name
     * @param {string} email        Employee Email
     * @param {number} salary       Employee Salary
     */
    static create(first_name: string, last_name: string, email: string, salary: number): Promise<any> {
        return new Promise((resolve, reject) => {
            EmployeeDAL.create(first_name, last_name, email, salary)
                .then((employee: Employee) => {
                    resolve(employee);
                })
                .catch((error: any) => {
                    reject(new BadInputError(error));
                });
        });
    }

    /**
     * Find All Employees
     */
    static findAll(): Promise<any> {
        return new Promise((resolve, reject) => {
            EmployeeDAL.findMany({})
                .then((employees: Employee[]) => {
                    resolve(employees);
                })
                .catch((error: any) => {
                    reject(new InternalServerError(error));
                });
        });
    }

    /**
     * Find Employee By Id
     * 
     * @param {String} id Client Id
     */
    static findById(id: String): Promise<any> {
        return new Promise((resolve, reject) => {
            EmployeeDAL.findOne({ _id: id })
                .then((employee: Employee) => {
                    if (employee) {
                        resolve(employee);
                    }
                    else {
                        reject(new NotFoundError(ERROR_MESSAGES.EMPLOYEE_NOT_FOUND_ERROR));
                    }
                    
                })
                .catch((error: any) => {
                    reject(new NotFoundError(error));
                });
        });
    }
};

export default EmployeeService;