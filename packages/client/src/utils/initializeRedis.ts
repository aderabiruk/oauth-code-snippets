import redis, { RedisClient } from 'redis';
import config from "config";

import logger from "./logger";

export let client: RedisClient;

export default () => {
    let host = config.get('redis.host');
    let port = parseInt(config.get('redis.port'));

    client = redis.createClient();
    client.on("connect", () => {
        logger.info(`Redis connection established.`);
    });
    client.on("end", () => {
        logger.info('Redis connection terminated.');
    });
};

