var express = require('express');
var router = express.Router();
const utils = require('../utils/utils')

/* GET home page. */
router.post('/', utils.isLoggedIn, function (req, res, next) {
  console.log(req.user)
  res.status(200).json({ message: "spotify" })
});

module.exports = router;

