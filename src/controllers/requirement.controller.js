const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const Requirement = require('../models/requirement.model'); // Importar directamente el modelo
const { Op } = require('sequelize');

// Configura tus credenciales y región de AWS
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  // Configuración optimizada para archivos grandes
  requestHandler: {
    httpOptions: {
      timeout: 300000, // 5 minutos para archivos grandes
      connectTimeout: 60000 // 1 minuto para conexión
    }
  }
});

const S3_BUCKET = process.env.AWS_S3_BUCKET; // El nombre de tu bucket

const requirementController = {
    getRequirements: async (req, res) => {
        try {
            const { dependency } = req.query;
            const where = dependency ? { dependency } : {};
            const requirements = await Requirement.findAll({
                where: {
                    [Op.or]: [
                        { userId: null },
                        { userId: req.userId }
                    ]
                }
            });

            console.log('Requirements encontrados:', requirements.length);

            const processedRequirements = requirements.map(req => {
                const data = req.toJSON();
                // Si el campo es string (por datos viejos), conviértelo a array
                if (typeof data.reminderDates === 'string') {
                    try {
                        data.reminderDates = JSON.parse(data.reminderDates);
                    } catch {
                        data.reminderDates = [];
                    }
                }
                if (!Array.isArray(data.reminderDates)) {
                    data.reminderDates = [];
                }

                if (typeof data.providers === 'string') {
                    try {
                        data.providers = JSON.parse(data.providers);
                    } catch {
                        data.providers = [];
                    }
                }
                if (!Array.isArray(data.providers)) {
                    data.providers = [];
                }
                return data;
            });
            
            return res.json({
                status: 'success',
                data: processedRequirements
            });
        } catch (error) {
            console.error('Error en getRequirements:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    createRequirement: async (req, res) => {
        try {
            const requirement = await Requirement.create({ ...req.body, userId: req.userId });
            
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

            if (requirement.userId !== req.userId) {
                return res.status(403).json({ status: 'error', message: 'No autorizado' });
            }

            const allowedUpdates = ['title', 'description', 'periodicity', 'period', 'completed', 'videoUrl', 'hasProvidersButton', 'subTitle', 'dependency', 'reminderDates', 'providers'];
            const updates = {};
            allowedUpdates.forEach(field => {
                updates[field] = req.body[field];
            });

            await requirement.update(updates);

            const data = requirement.toJSON();
            data.reminderDates = data.reminderDates || [];
            data.providers = data.providers || [];

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
                const key = `respaldos/${Date.now()}_${file.originalname}`;
                const command = new PutObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype
                });
                
                await s3Client.send(command);
                fileUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            }

            // 2. Actualizar el campo respaldo
            const respaldo = JSON.stringify({ url: fileUrl, nota });

            const requirement = await Requirement.findByPk(id);
            if (!requirement) {
                return res.status(404).json({ status: 'error', message: 'Requirement not found' });
            }

            if (requirement.userId !== req.userId) {
                return res.status(403).json({ status: 'error', message: 'No autorizado' });
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