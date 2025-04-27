const router = require('express').Router();
const scheduleController = require('../controllers/schedule.controller');
const { verifyToken } = require('../middleware/auth.jwt');

/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         type:
 *           type: string
 *           enum: [weekly, monthly]
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         progress:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         assignedTo:
 *           type: string
 *           format: uuid
 */

// All routes require authentication
router.use(verifyToken);

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Create a new schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', scheduleController.create);

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Get all schedules
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 */
router.get('/', scheduleController.findAll);

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     summary: Get schedule by ID
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Schedule found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Schedule not found
 */
router.get('/:id', scheduleController.findOne);

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Update a schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       404:
 *         description: Schedule not found
 */
router.put('/:id', scheduleController.update);

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     summary: Delete a schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       404:
 *         description: Schedule not found
 */
router.delete('/:id', scheduleController.delete);

/**
 * @swagger
 * /api/schedules/{id}/progress:
 *   put:
 *     summary: Update schedule progress
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - progress
 *             properties:
 *               progress:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       404:
 *         description: Schedule not found
 */
router.put('/:id/progress', scheduleController.updateProgress);

/**
 * @swagger
 * /api/schedules/{id}/statuses:
 *   put:
 *     summary: Update statuses for activities within a schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the schedule to update statuses for.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statuses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - activityId
 *                     - state
 *                   properties:
 *                     activityId:
 *                       type: string
 *                       format: uuid
 *                     state:
 *                       type: string
 *                       enum: [pending, completed, not_applicable] # Ajusta según tus estados
 *                     notes: # Opcional
 *                       type: string
 *     responses:
 *       200:
 *         description: Activity statuses updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Schedule or Activity not found
 *       500:
 *         description: Server error
 */
router.put('/:id/statuses', scheduleController.updateActivityStatuses); // <-- Nueva ruta

module.exports = router;