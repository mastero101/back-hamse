const { Sequelize, sequelize } = require('../config/database');

const ActivitySchedule = sequelize.define('ActivitySchedule', {
    programStates: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
    }
});

module.exports = ActivitySchedule;