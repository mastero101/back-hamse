const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middleware/auth.jwt');
const settingsController = require('../controllers/settings.controller');

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: API para gestionar la configuración de la aplicación
 */

/**
 * @swagger
 * /api/settings/whatsapp:
 *   get:
 *     summary: Obtener el número de WhatsApp configurado (Público)
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Número de WhatsApp actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 whatsappNumber:
 *                   type: string
 *       500:
 *         description: Error del servidor al obtener la configuración
 */
router.get('/whatsapp', settingsController.getWhatsappNumber);

/**
 * @swagger
 * /api/settings/whatsapp:
 *   put:
 *     summary: Actualizar el número de WhatsApp (Solo Admin)
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - whatsappNumber
 *             properties:
 *               whatsappNumber:
 *                 type: string
 *                 description: El nuevo número de WhatsApp
 *     responses:
 *       200:
 *         description: Número de WhatsApp actualizado correctamente
 *       400:
 *         description: Datos inválidos en la solicitud (falta whatsappNumber)
 *       401:
 *         description: No autorizado (token inválido o ausente)
 *       403:
 *         description: Prohibido (Requiere rol de Admin)
 *       500:
 *         description: Error del servidor al actualizar la configuración
 */
router.put('/whatsapp', [verifyToken, isAdmin], settingsController.updateWhatsappNumber);

module.exports = router;