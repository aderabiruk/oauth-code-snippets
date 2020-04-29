import config from "config";
import mongoose from 'mongoose';

import logger from "./logger";

export default () => {
    let dbHost = config.get('database.host');
    let dbName = config.get('database.name');
    let dbPort = config.get('database.port');

    let dbUrl = process.env.MONGODB_URI || `mongodb://${dbHost}:${dbPort}/${dbName}`;
    mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true});
    mongoose.connection.on('connected', () => {
        logger.info(`Database connection established with ${dbUrl}`);
    });
    
    mongoose.connection.on('error', (error) => {
        logger.error(`Database connection error: ${error}`);
    });
    
    mongoose.connection.on('disconnected', () => {
        logger.info('Database connection terminated.');
    });
};

