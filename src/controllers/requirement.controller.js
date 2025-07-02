const AWS = require('aws-sdk');
const Requirement = require('../models/requirement.model'); // Importar directamente el modelo

// Configura tus credenciales y región de AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const S3_BUCKET = process.env.AWS_S3_BUCKET; // El nombre de tu bucket

const requirementController = {
    getRequirements: async (req, res) => {
        try {
            const { dependency } = req.query;
            const where = dependency ? { dependency } : {};
            
            const requirements = await Requirement.findAll({ where });
            
            return res.json({
                status: 'success',
                data: requirements
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    createRequirement: async (req, res) => {
        try {
            const requirement = await Requirement.create(req.body);
            
            return res.status(201).json({
                status: 'success',
                data: requirement
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    updateRequirement: async (req, res) => {
        try {
            const { id } = req.params;
            const requirement = await Requirement.findByPk(id);

            if (!requirement) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Requirement not found'
                });
            }

            const allowedUpdates = ['title', 'description', 'periodicity', 'period', 'completed', 'videoUrl', 'hasProvidersButton', 'subTitle', 'dependency', 'reminderDate'];
            const updates = {};
            allowedUpdates.forEach(field => {
                if (req.body.hasOwnProperty(field)) {
                    updates[field] = req.body[field];
                }
            });

            await requirement.update(updates);

            return res.json({
                status: 'success',
                data: requirement
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    uploadRespaldoS3: async (req, res) => {
        try {
            const { id } = req.params;
            const nota = req.body.nota || '';
            const file = req.file;

            if (!file) {
                return res.status(400).json({ status: 'error', message: 'Archivo requerido.' });
            }

            // 1. Subir archivo a S3
            const s3Params = {
                Bucket: S3_BUCKET,
                Key: `respaldos/${Date.now()}_${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read' // O 'private' según tu necesidad
            };

            const uploadResult = await s3.upload(s3Params).promise();
            const fileUrl = uploadResult.Location;

            // 2. Actualizar el campo respaldo
            const respaldo = JSON.stringify({ url: fileUrl, nota });

            const requirement = await Requirement.findByPk(id);
            if (!requirement) {
                return res.status(404).json({ status: 'error', message: 'Requirement not found' });
            }

            requirement.respaldo = respaldo;
            await requirement.save();

            return res.json({
                status: 'success',
                message: 'Respaldo actualizado correctamente',
                respaldo: JSON.parse(respaldo)
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
};

module.exports = requirementController;