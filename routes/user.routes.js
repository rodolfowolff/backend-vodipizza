const Router = require('express');
const router = Router();

const { addUserAddress } = require('../controllers/user.controllers');
const { authCheck } = require('../middleware/auth.middleware');

router.route('/address/add').post(authCheck, addUserAddress);

module.exports = router;
