const router = require('express').Router();
const userRequirementController = require('../controllers/userRequirement.controller');
const { verifyToken } = require('../middleware/auth.jwt');
const multer = require('multer');
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB en bytes
    files: 1
  }
});

router.use(verifyToken);

// Obtener todos los estados de requerimientos para el usuario autenticado
router.get('/', userRequirementController.getAll);

// Obtener el estado de un requerimiento específico para el usuario autenticado
router.get('/:requirementId', userRequirementController.getOne);

// Crear o actualizar el estado de un requerimiento para el usuario autenticado
router.post('/', userRequirementController.upsert);

// Subir respaldo a S3 para un requerimiento de usuario
router.post('/:requirementId/respaldo', upload.single('file'), userRequirementController.uploadRespaldoS3);

module.exports = router; 