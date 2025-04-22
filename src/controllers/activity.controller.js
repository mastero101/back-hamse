const { Activity, Status } = require('../models');

const activityController = {
    // Create new activity
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

    // Get all activities
    findAll: async (req, res) => {
        try {
            const activities = await Activity.findAll({
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