const { Report, Schedule, Activity, Status, User } = require('../models');
const { Op } = require('sequelize');

const reportController = {
    generate: async (req, res) => {
        try {
            const { periodStart, periodEnd, type } = req.body;

            const schedules = await Schedule.findAll({
                where: {
                    startDate: {
                        [Op.between]: [periodStart, periodEnd]
                    }
                },
                include: [
                    {
                        model: Activity,
                        include: [Status]
                    }
                ]
            });

            const completionRate = schedules.reduce((acc, schedule) => 
                acc + schedule.progress, 0) / schedules.length;

            const report = await Report.create({
                title: `${type} Report - ${new Date().toISOString().split('T')[0]}`,
                type,
                periodStart,
                periodEnd,
                completionRate,
                generatedBy: req.userId,
                data: {
                    schedules: schedules.map(s => ({
                        id: s.id,
                        progress: s.progress,
                        activities: s.Activities.map(a => ({
                            name: a.name,
                            status: a.Status?.state || 'unchecked'
                        }))
                    }))
                }
            });

            return res.status(201).json({
                status: 'success',
                data: report
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
            const reports = await Report.findAll({
                include: [{
                    model: User,
                    attributes: ['username']
                }],
                order: [['generatedAt', 'DESC']]
            });

            return res.json({
                status: 'success',
                data: reports
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
            const report = await Report.findByPk(req.params.id, {
                include: [{
                    model: User,
                    attributes: ['username']
                }]
            });

            if (!report) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Report not found'
                });
            }

            return res.json({
                status: 'success',
                data: report
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
            const report = await Report.findByPk(req.params.id);

            if (!report) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Report not found'
                });
            }

            await report.destroy();

            return res.json({
                status: 'success',
                message: 'Report deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

module.exports = reportController;