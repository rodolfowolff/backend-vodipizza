const express = require('express');
const router = express.Router();

const { authController } = require('../controllers/auth.controllers');
const { validRegister } = require('../validations/register.validations');
const { authCheck } = require('../middleware/auth.middleware');

router.route('/register').post(validRegister, authController.register);

router.route('/login').post(authController.login);

router.route('/logout').get(authCheck, authController.logout);

router.route('/refresh_token').get(authController.refreshToken);

router.route('/google_login').post(authController.googleLogin);

router.route('/forgot_password').post(authController.forgotPassword);

module.exports = router;
