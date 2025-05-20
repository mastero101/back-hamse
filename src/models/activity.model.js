const { Sequelize, sequelize } = require('../config/database');

const Activity = sequelize.define('Activity', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT
    },
    frequency: {
        type: Sequelize.ENUM('daily', 'weekly', 'monthly', 'yearly'),
        allowNull: false
    },
    expectedDuration: {
        type: Sequelize.INTEGER, // in minutes
        allowNull: false
    },
    category: {
        type: Sequelize.STRING
    },
    priority: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
    }
});

module.exports = Activity;