const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLog.controller');
const { verifyToken } = require('../middleware/auth.jwt');

// Ruta para crear un log de auditoría
router.post('/', auditLogController.createAuditLog);
// Ruta para consultar todos los logs de auditoría
router.get('/', auditLogController.getAuditLogs);

/**
 * @swagger
 * /api/audit-logs/cleanup-old:
 *   post:
 *     summary: Elimina logs de auditoría anteriores a X meses (solo admin)
 *     tags: [AuditLogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               months:
 *                 type: integer
 *                 description: Meses hacia atrás para eliminar logs (por defecto 2)
 *     responses:
 *       200:
 *         description: Cantidad de logs eliminados
 *       403:
 *         description: No autorizado
 */
router.post('/cleanup-old', verifyToken, auditLogController.cleanupOldLogs);

module.exports = router; 