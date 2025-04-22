const { Schedule, Activity, Status, User } = require('../models');

const scheduleController = {
    create: async (req, res) => {
        try {
            const schedule = await Schedule.create({
                ...req.body,
                assignedTo: req.userId
            });

            if (req.body.activities) {
                await schedule.setActivities(req.body.activities);
            }

            return res.status(201).json({
                status: 'success',
                data: schedule
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    findAll: async (req, res) => {
        try {
            const schedules = await Schedule.findAll({
                include: [
                    {
                        model: Activity,
                        through: { attributes: [] }
                    },
                    {
                        model: User,
                        attributes: ['id', 'username']
                    }
                ]
            });

            return res.json({
                status: 'success',
                data: schedules
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    findOne: async (req, res) => {
        try {
            const schedule = await Schedule.findByPk(req.params.id, {
                include: [
                    {
                        model: Activity,
                        include: [Status]
                    },
                    {
                        model: User,
                        attributes: ['id', 'username']
                    }
                ]
            });

            if (!schedule) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Schedule not found'
                });
            }

            return res.json({
                status: 'success',
                data: schedule
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    update: async (req, res) => {
        try {
            const schedule = await Schedule.findByPk(req.params.id);

            if (!schedule) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Schedule not found'
                });
            }

            await schedule.update(req.body);

            if (req.body.activities) {
                await schedule.setActivities(req.body.activities);
            }

            return res.json({
                status: 'success',
                data: schedule
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    delete: async (req, res) => {
        try {
            const schedule = await Schedule.findByPk(req.params.id);

            if (!schedule) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Schedule not found'
                });
            }

            await schedule.destroy();

            return res.json({
                status: 'success',
                message: 'Schedule deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    updateProgress: async (req, res) => {
        try {
            const schedule = await Schedule.findByPk(req.params.id);
            const totalActivities = await schedule.countActivities();
            const completedActivities = await Status.count({
                where: {
                    state: 'verified',
                    ScheduleId: schedule.id
                }
            });

            const progress = (completedActivities / totalActivities) * 100;
            await schedule.update({ progress });

            return res.json({
                status: 'success',
                data: { progress }
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

module.exports = scheduleController;