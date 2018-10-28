const redis = require('../redis');
const axios = require('axios');
const logger = require('../logger');

class urlProcessor {
    
    async process(req, res){
        let resolve = await urlProcessor.responseStrategy(req.query.url, res);
    }

    static async fetchStrategy(url, res) {
        let results = await urlProcessor.fetchFromWeb(url);
        urlProcessor.respondToClient(results, res);
        redis.saveToRedis(results);
    }

    //Strategy to make the response
    static async responseStrategy(url, res){
        let results = await redis.fetchFromCache(url);
        if (results){
            urlProcessor.respondToClient(results, res);
        }
        else {
            urlProcessor.fetchStrategy(url, res)
        }
    }

    //Use axios to get url from web
    static async fetchFromWeb(url){
        let res = await axios.get(url)
        return {
            fromCache: false,
            url,
            status: res.status,
            body: res.data,
            headers: redis.addCacheHeaders(res.headers, false)
        }
    }

    //Client response
    static async respondToClient(result, res) {
        logger.info(JSON.stringify(result.headers));
        res
            .set(result.headers)
            .status(result.status)
            .send(result.body);
        return result;
    }

}

module.exports =  urlProcessor;