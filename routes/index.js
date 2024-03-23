var express = require('express');
var router = express.Router();
const utils = require('../utils/utils')
const multer = require('multer')
const indexController = require('../controllers/index')


// Configure Multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })



router.post('/upload', upload.single('file'), indexController.upload);

/* GET home page. */
router.post('/', utils.isLoggedIn, indexController.index);

module.exports = router;

