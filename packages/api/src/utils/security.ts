import fs from 'fs';
import path from 'path';
import config from 'config';
import jsonwebtoken from 'jsonwebtoken';

const PublicKey = fs.readFileSync(path.resolve(__dirname, config.get('security.keys.public')), 'utf8');

/**
 * Decode JWT Access Token
 * 
 * @param {string} token
 */
export const decodeAccessToken = (token: string) => {
    return jsonwebtoken.verify(token, PublicKey, {
        algorithms: ["RS256"]
    });
};

