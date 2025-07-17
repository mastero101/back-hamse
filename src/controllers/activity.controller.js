const { Activity, Status } = require('../models');

const getPagination = (page, size) => {
    const limit = size ? +size : 20;
    const offset = page ? (page - 1) * limit : 0;
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, items, totalPages, currentPage };
};

// Eliminamos la función exports.getAllActivities separada si la lógica se integra en findAll

const activityController = {
    create: async (req, res) => {
        try {
            const activity = await Activity.create(req.body);
            return res.status(201).json({
                status: 'success',
                data: activity
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Get all activities with pagination
    findAll: async (req, res) => {
        const { page = 1, size = 20, category } = req.query;
        const limit = Math.min(+size, 50); // Limita el tamaño máximo de página a 50
        const offset = (page - 1) * limit;

        try {
            const whereClause = {};
            if (category) {
                whereClause.category = category;
            }

            const data = await Activity.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                attributes: ['id', 'name', 'frequency', 'category', 'priority'], // Solo los campos necesarios
                order: [['createdAt', 'DESC']]
            });

            const totalPages = Math.ceil(data.count / limit);
            // Si la página solicitada es mayor al total, devuelve vacío
            if (page > totalPages) {
                return res.status(200).json({
                    success: true,
                    message: 'No hay más actividades.',
                    data: { totalItems: data.count, items: [], totalPages, currentPage: page }
                });
            }

            const response = getPagingData(data, page, limit);
            return res.status(200).json({
                success: true,
                message: 'Actividades recuperadas exitosamente.',
                data: response
            });
        } catch (error) {
            console.error('Error al obtener actividades paginadas:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Ocurrió un error al recuperar las actividades.'
            });
        }
    },

    // Get activity by ID
    findOne: async (req, res) => {
        try {
            const activity = await Activity.findByPk(req.params.id, {
                include: [{
                    model: Status,
                    attributes: ['state', 'completedAt', 'notes']
                }]
            });

            if (!activity) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Activity not found'
                });
            }

            return res.json({
                status: 'success',
                data: activity
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Update activity
    update: async (req, res) => {
        try {
            const activity = await Activity.findByPk(req.params.id);

            if (!activity) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Activity not found'
                });
            }

            await activity.update(req.body);
            return res.json({
                status: 'success',
                data: activity
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Delete activity
    delete: async (req, res) => {
        try {
            const activity = await Activity.findByPk(req.params.id);

            if (!activity) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Activity not found'
                });
            }

            await activity.destroy();
            return res.json({
                status: 'success',
                message: 'Activity deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Get activities by frequency
    findByFrequency: async (req, res) => {
        try {
            const activities = await Activity.findAll({
                where: {
                    frequency: req.params.frequency
                },
                include: [{
                    model: Status,
                    attributes: ['state', 'completedAt']
                }]
            });

            return res.json({
                status: 'success',
                data: activities
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};
module.exports = activityController;
