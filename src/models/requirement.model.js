const { Sequelize, sequelize } = require('../config/database');

const Requirement = sequelize.define('Requirement', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    periodicity: {
        type: Sequelize.STRING,
        allowNull: false
    },
    period: {
        type: Sequelize.STRING,
        allowNull: false
    },
    completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    videoUrl: {
        type: Sequelize.STRING,
        allowNull: true
    },
    hasProvidersButton: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    subTitle: {
        type: Sequelize.STRING,
        allowNull: true
    },
    dependency: {
        type: Sequelize.STRING,
        allowNull: false
    },
    reminderDates: {
        type: Sequelize.ARRAY(Sequelize.DATE),
        allowNull: true
    },
    respaldo: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    providers: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
    }
});

module.exports = Requirement;