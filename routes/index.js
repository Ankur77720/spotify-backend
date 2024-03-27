var express = require('express');
var router = express.Router();
const utils = require('../utils/utils')
const multer = require('multer')
const indexController = require('../controllers/index')


// Configure Multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/upload', utils.isLoggedIn, upload.array('file'), indexController.upload);
router.post('/', utils.isLoggedIn, indexController.index);
router.post('/getTracks', utils.isLoggedIn, indexController.getRandomTracks);
router.put('/history', utils.isLoggedIn, indexController.createHistory);
router.post('/like', utils.isLoggedIn, indexController.likeTrack);
router.post('/checkLike', utils.isLoggedIn, indexController.checkLike);
router.post('/getLastTrack', utils.isLoggedIn, indexController.getLastTrack);



module.exports = router;

