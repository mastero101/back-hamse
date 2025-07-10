const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLog.controller');

// Ruta para crear un log de auditoría
router.post('/', auditLogController.createAuditLog);
// Ruta para consultar todos los logs de auditoría
router.get('/', auditLogController.getAuditLogs);

module.exports = router; 