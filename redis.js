const redis = require('redis');
const {promisify} = require('util');
const logger = require('./logger');

const REDIS_TTL = '300'; // 5 minutes

class redisClient {
    constructor() {
        this.client = redis.createClient({
            port      : 6379,
            host      : 'localhost'
        });
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.REDIS_TTL = REDIS_TTL;
    } 

    async fetchFromCache(url) {
        let res = await this.getAsync(url);
            if (res !== null) {
                logger.info('In cache');
                const response = JSON.parse(res);
                return {
                    fromCache: true,
                    url,
                    status: response.status,
                    body: response.body,
                    headers: this.addCacheHeaders(response.headers, true),
                };
            }
        logger.error('Not in cache');
    };

    async saveToRedis(result) {
        if (!result.fromCache) {
            const {
                url,
                status,
                body,
                headers,
            } = result;
            const saveStr = JSON.stringify({ status, body, headers });
            // Save and set expiration time
            this.client.set(url, saveStr);
            this.client.expire(url, REDIS_TTL);
        }
        return result;
    }
    
    addCacheHeaders(headers, fromCache){
        headers['cache-control'] = `public, max-age=${REDIS_TTL}`;
        headers['X-Cache'] = fromCache;
        return headers;
    }

}

const instance = new redisClient();
module.exports = instance;