const redis = require('redis');
const client = redis.createClient({
    port      : global.gConfig.node_port,
    host      : 'localhost'
});

module.exports = client;