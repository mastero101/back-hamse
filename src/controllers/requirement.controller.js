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

            // Procesar reminderDates para devolverlo como array
            const processedRequirements = requirements.map(req => {
                const data = req.toJSON();
                if (data.reminderDates) {
                    try {
                        data.reminderDates = JSON.parse(data.reminderDates);
                    } catch {
                        data.reminderDates = [];
                    }
                } else {
                    data.reminderDates = [];
                }
                return data;
            });
            
            return res.json({
                status: 'success',
                data: processedRequirements
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

            const allowedUpdates = ['title', 'description', 'periodicity', 'period', 'completed', 'videoUrl', 'hasProvidersButton', 'subTitle', 'dependency', 'reminderDates'];
            const updates = {};
            allowedUpdates.forEach(field => {
                if (req.body.hasOwnProperty(field)) {
                    if (field === 'reminderDates' && Array.isArray(req.body.reminderDates)) {
                        updates.reminderDates = JSON.stringify(req.body.reminderDates);
                    } else {
                        updates[field] = req.body[field];
                    }
                }
            });

            await requirement.update(updates);

            // Procesar reminderDates para devolverlo como array
            const data = requirement.toJSON();
            if (data.reminderDates) {
                try {
                    data.reminderDates = JSON.parse(data.reminderDates);
                } catch {
                    data.reminderDates = [];
                }
            } else {
                data.reminderDates = [];
            }

            return res.json({
                status: 'success',
                data
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

            let fileUrl = '';
            if (file) {
                // 1. Subir archivo a S3
                const s3Params = {
                    Bucket: S3_BUCKET,
                    Key: `respaldos/${Date.now()}_${file.originalname}`,
                    Body: file.buffer,
                    ContentType: file.mimetype
                };
                const uploadResult = await s3.upload(s3Params).promise();
                fileUrl = uploadResult.Location;
            }

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