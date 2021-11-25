const express = require('express');
const router = express.Router();

const { authCheck } = require('../middleware/auth.middleware');
const { updateUser, resetPassword, getUser } = require('../controllers/user.controllers');

router.route('/user').patch(authCheck, updateUser);

router.route('/reset_password').patch(authCheck, resetPassword);

router.route('/user/:id').get(getUser);

module.exports = router;
