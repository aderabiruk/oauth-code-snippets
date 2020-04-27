import AuthorizationCode from "../models/AuthorizationCode";

class AuthorizationCodeDAL {
    /**
     * Create AuthorizationCode
     * 
     * @param {string} name     Client Id
     * @param {string} code     Client Secret
     * @param {string} scope    Client Scope
     */
    static create(client_id: string, code: string, scope: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let authorizationCode = new AuthorizationCode();
            authorizationCode.client_id = client_id;
            authorizationCode.code = code;
            authorizationCode.scope = scope;
            authorizationCode.save((error, savedAuthorizationCode) => {
                if (error) {
                    reject(error.message);
                }
                else {
                    resolve(savedAuthorizationCode);
                }
            });
        });
    }

    /**
     * Find an Authorization Code
     * 
     * @param {Object} query Query Object
     */
    static findOne(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            AuthorizationCode.findOne({...query, deleted_at: null}, (error, client) => {
                if (error) {
                    reject(error.message);
                }
                else {
                    resolve(client);
                }
            });
        });
    }

    /**
     * Delete an Authorization Code
     * 
     * @param {Object} query Query Object
     */
    static delete(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            AuthorizationCode.findByIdAndRemove({...query, deleted_at: null}, (error, authorizationCode) => {
                if (error) {
                    reject(error.message);
                }
                else {
                    resolve(authorizationCode);
                }
            });
        });
    }
}

export default AuthorizationCodeDAL;