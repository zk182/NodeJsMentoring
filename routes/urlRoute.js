const express = require('express');
const urlRouter = express.Router();
const urlProcessor = require('../controllers/urlProcessor');

urlRouter.route('/pull')
    .get(function(req, res){
        let testUrl = new urlProcessor();
        testUrl.process(req, res);
    });

module.exports = urlRouter;