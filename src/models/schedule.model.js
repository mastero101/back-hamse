const { Sequelize, sequelize } = require('../config/database');

const Schedule = sequelize.define('Schedule', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    startDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    endDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    type: {
        type: Sequelize.ENUM('daily', 'weekly', 'monthly', 'yearly'),
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('pending', 'in_progress', 'completed'),
        defaultValue: 'pending'
    },
    progress: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    assignedTo: {
        type: Sequelize.UUID,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
});

module.exports = Schedule;