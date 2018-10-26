const redis = require('../redis.js')
class urlProcessor {
    
    async process(req, res){
        let resolve = await redis.responseStrategy(req.query.url, res);
    }
}

module.exports =  urlProcessor;