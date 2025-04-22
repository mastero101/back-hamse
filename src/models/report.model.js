const { Sequelize, sequelize } = require('../config/database');

const Report = sequelize.define('Report', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.ENUM('weekly', 'monthly', 'custom'),
        allowNull: false
    },
    periodStart: {
        type: Sequelize.DATE,
        allowNull: false
    },
    periodEnd: {
        type: Sequelize.DATE,
        allowNull: false
    },
    summary: {
        type: Sequelize.TEXT
    },
    completionRate: {
        type: Sequelize.FLOAT,
        validate: {
            min: 0,
            max: 100
        }
    },
    generatedBy: {
        type: Sequelize.UUID,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    generatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    data: {
        type: Sequelize.JSONB,
        allowNull: false
    }
});

module.exports = Report;