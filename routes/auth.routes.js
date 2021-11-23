const Router = require('express');
const router = Router();

const { createOrupdateUser, getCurrentUser } = require('../controllers/auth.controllers');
const { authCheck } = require('../middleware/auth.middleware');

router.route('/').post(authCheck, createOrupdateUser);
router.route('/current').get(authCheck, getCurrentUser);

module.exports = router;
