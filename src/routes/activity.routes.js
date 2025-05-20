const router = require('express').Router();
const activityController = require('../controllers/activity.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.jwt');

/**
 * @swagger
 * components:
 *   schemas:
 *     Activity:
 *       type: object
 *       required:
 *         - name
 *         - frequency
 *         - expectedDuration
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         frequency:
 *           type: string
 *           enum: [weekly, monthly]
 *         expectedDuration:
 *           type: integer
 *           description: Duration in minutes
 *         category:
 *           type: string
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 */

/**
 * @swagger
 * /api/activities:
 *   get:
 *     summary: Listar todas las actividades con paginación
 *     tags: [Activities]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para la paginación.
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de actividades por página.
 *     responses:
 *       200:
 *         description: Una lista paginada de actividades.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Actividades recuperadas exitosamente.
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 100
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Activity'
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *       500:
 *         description: Error del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Ocurrió un error al recuperar las actividades.
 */
router.get('/', activityController.findAll);

/**
 * @swagger
 * /api/activities/{id}:
 *   get:
 *     summary: Get activity by ID
 *     tags: [Activities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity found
 *       404:
 *         description: Activity not found
 */
router.get('/:id', activityController.findOne);

/**
 * @swagger
 * /api/activities:
 *   post:
 *     summary: Create a new activity
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Activity'
 *     responses:
 *       201:
 *         description: Activity created
 *       401:
 *         description: Unauthorized
 */
router.post('/', [verifyToken], activityController.create);

/**
 * @swagger
 * /api/activities/{id}:
 *   put:
 *     summary: Update an activity
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Activity'
 *     responses:
 *       200:
 *         description: Activity updated
 *       404:
 *         description: Activity not found
 */
router.put('/:id', [verifyToken], activityController.update);

/**
 * @swagger
 * /api/activities/{id}:
 *   delete:
 *     summary: Delete an activity
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity deleted
 *       404:
 *         description: Activity not found
 */
router.delete('/:id', [verifyToken, isAdmin], activityController.delete);

module.exports = router;