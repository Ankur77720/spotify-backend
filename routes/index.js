var express = require('express');
var router = express.Router();
const utils = require('../utils/utils')
const multer = require('multer')
const indexController = require('../controllers/index')


// Configure Multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
router.use(utils.isLoggedIn);

router.post('/upload', upload.array('file'), indexController.upload);
router.post('/', indexController.index);
router.post('/getTracks', indexController.getRandomTracks);
router.put('/history', indexController.createHistory);
router.post('/like', indexController.likeTrack);
router.post('/checkLike', indexController.checkLike);




module.exports = router;

