// config variables
process.env.NODE_ENV = 'development';
const config = require('./config/config.js');

// modules
const express = require('express')();
const app = express();
const testRouter = require('./routes/testRoute');
/*
const client    = redis.createClient({
    port      : global.gConfig.node_port,               // replace with your port
    host      : 'localhost',                            // replace with your hostanme or IP address
    password  : 'test',                                 // replace with your password
  });
*/
//config file
app.get('/', (req, res) => res.json(global.gConfig));

//routes
app.use('/test', testRouter);
app.listen(global.gConfig.node_port, () => console.log(`Listening on port ${global.gConfig.node_port}`));