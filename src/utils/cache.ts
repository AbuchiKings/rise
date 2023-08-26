import dotenv from 'dotenv'

import { createClient } from 'redis'
import util from 'util';

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    retry_strategy: (options: any) => {
        if (options.attempt > 20) {
            return undefined;
        }
        return 3000;
    },
});


client.on('connect', () => {
    // eslint-disable-next-line
    console.log('Connected to redis server');
    return;
});

// @ts-ignore
client.on('error', (error) => {
    // eslint-disable-next-line
    console.log(`Redis server error: ${error}`);
    return;
});

export const rdGet = util.promisify(client.get).bind(client);
export const rdSet = util.promisify(client.set).bind(client);
export const rdDel = util.promisify(client.del).bind(client);
export const rdExp = util.promisify(client.expire).bind(client);
