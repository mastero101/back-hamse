const router = require('express').Router();
const requirementController = require('../controllers/requirement.controller');
const { verifyToken } = require('../middleware/auth.jwt');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * components:
 *   schemas:
 *     Requirement:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         periodicity:
 *           type: string
 *         period:
 *           type: string
 *         completed:
 *           type: boolean
 *         videoUrl:
 *           type: string
 *         hasProvidersButton:
 *           type: boolean
 *         subTitle:
 *           type: string
 *         dependency:
 *           type: string
 */

/**
 * @swagger
 * /api/requirements:
 *   get:
 *     summary: Obtener todos los requerimientos
 *     tags: [Requirements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dependency
 *         schema:
 *           type: string
 *         description: Filtrar por dependencia
 *     responses:
 *       200:
 *         description: Lista de requerimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Requirement'
 */
router.use(verifyToken);

router.get('/', requirementController.getRequirements);

/**
 * @swagger
 * /api/requirements:
 *   post:
 *     summary: Crear un nuevo requerimiento
 *     tags: [Requirements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Requirement'
 *     responses:
 *       201:
 *         description: Requerimiento creado exitosamente
 */
router.post('/', requirementController.createRequirement);

/**
 * @swagger
 * /api/requirements/{id}:
 *   put:
 *     summary: Actualizar un requerimiento existente
 *     tags: [Requirements]
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
 *             $ref: '#/components/schemas/Requirement'
 *     responses:
 *       200:
 *         description: Requerimiento actualizado exitosamente
 *       404:
 *         description: Requerimiento no encontrado
 */
router.put('/:id', requirementController.updateRequirement);

router.post('/:id/respaldo', upload.single('file'), requirementController.uploadRespaldoS3);

module.exports = router;