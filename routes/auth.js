var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth')


router.post("/register", authController.registerPost)
router.post("/login", authController.loginPost)




router.use('*', (req, res, next) => {
    res.send('beat-stream')
})
module.exports = router;