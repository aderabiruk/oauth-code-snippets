import Client from "../models/Client";

class ClientDAL {
    
    /**
     * Create Client
     * 
     * @param {String}   name            Client Name
     * @param {String}   secret          Client Secret
     * @param {String}   redirect_uri    Client redirect_uri
     * @param {Array}    scopes          Client Scopes 
     */
    static create(name: String, secret: String, redirect_uri: String, scopes: String[]): Promise<any> {
        return new Promise((resolve, reject) => {
            let client = new Client();
            client.name = name;
            client.secret = secret;
            client.redirect_uri = redirect_uri;
            client.scopes = scopes;
            client.save((error, savedClient) => {
                if (error) {
                    reject(error.message);
                }
                else {
                    resolve(savedClient);
                }
            });
        });
    }

    /**
     * Find Many Clients
     * 
     * @param {Object} query Query Object
     */
    static findMany(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Client.find({...query, deleted_at: null}, (error, clients) => {
                if (error) {
                    reject(error.message);
                }
                else {
                    resolve(clients);
                }
            });
        });
    }

    /**
     * Find a Client
     * 
     * @param {Object} query Query Object
     */
    static findOne(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Client.findOne({...query, deleted_at: null}, (error, client) => {
                if (error) {
                    reject(error.message);
                }
                else {
                    resolve(client);
                }
            });
        });
    }
}

export default ClientDAL;