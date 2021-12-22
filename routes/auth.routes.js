const express = require('express');
const router = express.Router();

const { authController, getCurrentUser } = require('../controllers/auth.controllers');
const { validRegister } = require('../validations/register.validations');
const { authCheck } = require('../middleware/auth.middleware');

router.route('/register').post(validRegister, authController.register);

router.route('/login').post(authController.login);

router.route('/logout').get(authCheck, authController.logout);

router.route('/refresh_token').get(authController.refreshToken);

router.route('/current').get(authCheck, authController.refreshToken);

// router.route('/current').get(authCheck, getCurrentUser);

module.exports = router;
