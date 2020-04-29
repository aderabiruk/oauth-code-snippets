import Employee from "../models/Employee";

class EmployeeDAL {
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
            let employee = new Employee();
            employee.first_name = first_name;
            employee.last_name = last_name;
            employee.email = email;
            employee.salary = salary;
            employee.save((error, savedEmployee) => {
                if (error) {
                    reject(error.message);
                }
                else {
                    resolve(savedEmployee);
                }
            });
        });
    }

    /**
     * Find Many Employees
     * 
     * @param {Object} query Query Object
     */
    static findMany(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Employee.find({...query, deleted_at: null}, (error, employees) => {
                if (error) {
                    reject(error.message);
                }
                else {
                    resolve(employees);
                }
            });
        });
    }

    /**
     * Find an Employee
     * 
     * @param {Object} query Query Object
     */
    static findOne(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Employee.findOne({...query, deleted_at: null}, (error, employees) => {
                if (error) {
                    reject(error.message);
                }
                else {
                    resolve(employees);
                }
            });
        });
    }
};

export default EmployeeDAL;