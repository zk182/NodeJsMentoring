// config variables
const config = require('./config/config.js');

// modules
const express = require('express');
const app = express();
const routes = require('./routes');

//config file
app.get('/', (req, res) => res.json(config));

//routes
app.use('/test', routes);
app.listen(config.node_port, () => console.log(`Listening on port ${config.node_port}`));