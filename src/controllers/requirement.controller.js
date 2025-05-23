const Requirement = require('../models/requirement.model'); // Importar directamente el modelo

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

            await requirement.update(req.body);
            
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
    }
};

module.exports = requirementController;