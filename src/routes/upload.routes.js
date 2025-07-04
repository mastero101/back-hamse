const router = require('express').Router();
const uploadController = require('../controllers/upload.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Ruta para subir una imagen a S3
router.post('/image', upload.single('file'), uploadController.uploadImageS3);

module.exports = router; 