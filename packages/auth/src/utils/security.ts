import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import config from 'config';
import JwtStrategy from 'passport-jwt';
import jsonwebtoken from 'jsonwebtoken';
import LocalStrategy from 'passport-local';

import { User } from '../models/User';
import { Client } from '../models/Client';
import UserService from '../services/User.service';
import { ERROR_MESSAGES } from '../errors/constants';


const PublicKey = fs.readFileSync(path.resolve(__dirname, config.get('security.keys.public')), 'utf8');
const PrivateKey = fs.readFileSync(path.resolve(__dirname, config.get('security.keys.private')), 'utf8');

/**
 * Hash Password
 * 
 * @param {string} password
 * @param {string} saltRound
 */
export const hash = (password: string, saltRound: string) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRound, (error, hash) => {
            if (error) {
                reject(error.message);
            }
            else {
                resolve(hash);
            }
        });
    });
};

/**
 * Compare Password
 * 
 * @param {string} candidatePassword
 * @param {string} password
 */
export const comparePassword = (candidatePassword: string, password: string) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, password, (error, isMatch) => {
            if (error) {
                reject(error.message);
            }
            else {
                resolve(isMatch);
            }
        });
    });
};

/**
 * Generate JWT Access Token
 * 
 * @param {User}   user
 * @param {string} expiresIn
 */
export const generateAccessToken = (user: User, expiresIn: string) => {
    return jsonwebtoken.sign({
        _id: user._id,
        email: user.email,
    }, PrivateKey, {
       algorithm: "RS256",
       expiresIn: expiresIn
    });
};

/**
 * Generate JWT Access Token for Client
 * 
 * @param {Client} client
 * @param {string} scope
 * @param {string} expiresIn
 */
export const generateAccessTokenForClient = (client: Client, scope: string, expiresIn: string) => {
    return jsonwebtoken.sign({
        client_id: client._id,
        client_name: client.name,
        scope: scope
    }, PrivateKey, {
       algorithm: "RS256",
       expiresIn: expiresIn
    });
};

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

/**
 * Local Strategy
 */
export const PassportLocalStrategy = new LocalStrategy.Strategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => {
    UserService.findOne({ email: email.toLowerCase() })
        .then((user: User) => {
            if (user) {
                comparePassword(password, user.password.toString())
                    .then((isMatch: boolean) => {
                        if (isMatch) {
                            return done(null, user);
                        }
                        else {
                            return done(null, false, { message: ERROR_MESSAGES.AUTHENTICATION_ERROR });
                        }
                    })
                    .catch((error) => {
                        return done(null, false, error);
                    });          
            }
            else {
                return done(null, false, { message: ERROR_MESSAGES.AUTHENTICATION_ERROR });
            }
        })
        .catch((error: any) => {
            return done(error);
        });
});

/**
 * JWT Strategy
 */
export const PassportJWTStrategy = new JwtStrategy.Strategy({ jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: PublicKey }, (payload, done) => {
    UserService.findOne({ _id: payload._id })
        .then((user: User) => {
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
        .catch(() => {
            return done(null, false);
        });
});

/**
 * Decode Base64
 */
export const decodeBasicAuthenticationHeader = (data: string) => {
    if (data) {
        let decodedHeader = Buffer.from(data.split(" ")[1], 'base64').toString().split(":");
        return {
            client_id: decodedHeader[0],
            client_secret: decodedHeader[1]
        };
    }
    else {
        return {};
    }
};