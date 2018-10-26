const redis = require('redis');
const {promisify} = require('util');
const axios = require('axios');
const logger = require('./logger');

const REDIS_TTL = '300'; // 5 minutes

class redisClient {
    constructor() {
        this.client = redis.createClient({
            port      : 6379,
            host      : 'localhost'
        });
        this.getAsync = promisify(this.client.get).bind(this.client);
    } 

    async fetchStrategy(url, res) {
        let results = await this.fetchFromWeb(url);
        this.respondToClient(results, res);
        this.saveToRedis(results);
    }

    async responseStrategy(url, res){
        let results = await this.fetchFromCache(url);
        if (results){
            this.respondToClient(results, res);
        }
        else {
            this.fetchStrategy(url, res)
        }
    }

    async fetchFromCache(url) {
        let res = await this.getAsync(url);
            if (res !== null) {
               const response = JSON.parse(res);
                return {
                    fromCache: true,
                    url,
                    status: response.status,
                    body: response.body,
                    headers: this.addCacheHeaders(response.headers, REDIS_TTL, true),
                };
            }
        logger.error('Not in cache');
        //PREGUNTAR
        //throw new Error('Not in cache'); 
    };

    async fetchFromWeb(url){
       let res = await axios.get(url)
       return {
            fromCache: false,
            url,
            status: res.status,
            body: res.data,
            headers: this.addCacheHeaders(res.headers, REDIS_TTL, false)
       }
    }

    async respondToClient(result, res) {
        logger.info(JSON.stringify(result.headers));
        res
            .set(result.headers)
            .status(result.status)
            .send(result.body);
        return result;
    }

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

    addCacheHeaders(headers, cacheExpiration, fromCache){
        headers['cache-control'] = `public, max-age=${cacheExpiration}`;
        headers['X-Cache'] = fromCache;
        return headers;
    }

}

const instance = new redisClient();
module.exports = instance;