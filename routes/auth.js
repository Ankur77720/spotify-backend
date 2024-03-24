var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth')
const utils = require('../utils/utils')


router.post("/register", authController.registerPost)
router.post("/login", authController.loginPost)
router.post('/isAuthenticate', authController.isAuthenticated)




module.exports = router;