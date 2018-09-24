const express = require('express');
const testRouter = express.Router();
const testController = require('../controllers/testController')();

testRouter.route('/pull')
    .get(testController.getPage);

module.exports = testRouter;