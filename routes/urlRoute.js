const express = require('express');
const urlRouter = express.Router();
const urlProcessor = require('../controllers/urlProcessor');

urlRouter.route('/pull')
    .get(function(req, res){
        let urlP = new urlProcessor();
        urlP.process(req, res);
    });

module.exports = urlRouter;