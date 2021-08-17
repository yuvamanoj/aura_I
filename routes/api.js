var express = require('express');
const AuthController = require('../controllers/authenticate.js');
const userRouter = require('./user');
const credentialsRouter = require('./credentials');



var router = express.Router();

router.use('/', AuthController.validateAuthorization);

router.use('/users', userRouter);
router.use('/credentials', credentialsRouter);


module.exports = router;