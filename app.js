const express = require('express');
const app = express();

// config variables
process.env.NODE_ENV = 'development';
const config = require('./config/config.js');

app.get('/', (req, res) => res.json(global.gConfig));

app.listen(global.gConfig.node_port, () => console.log(`Listening on port ${global.gConfig.node_port}`));