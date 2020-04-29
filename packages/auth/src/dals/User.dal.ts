import User from "../models/User";

class UserDAL {

    /**
     * Create User
     * 
     * @param {String} email     User email address
     * @param {String} password  User password
     */
    static create(email: String, password: String): Promise<any> {
        return new Promise((resolve, reject) => {
            let user = new User();
            user.email = email;
            user.password = password;
            user.save((error, savedUser) => {
                if (error) {
                    reject(error.message);
                }
                else {
                    resolve(savedUser);
                }
            });
        });
    }

    /**
     * Find Many Users
     * 
     * @param {any} query Query Object
     */
    static findMany(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            User.find({...query, deleted_at: null}, (error, users) => {
                if (error) {
                    reject(error.message);
                }
                else {
                    resolve(users);
                }
            });
        });
    }

    /**
     * Find a User
     * 
     * @param {any} query Query Object
     */
    static findOne(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            User.findOne({...query, deleted_at: null}, (error, users) => {
                if (error) {
                    reject(error.message);
                }
                else {
                    resolve(users);
                }
            });
        });
    }
}

export default UserDAL;