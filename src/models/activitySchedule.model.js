const { Sequelize, sequelize } = require('../config/database');

const ActivitySchedule = sequelize.define('ActivitySchedule', {
    programStates: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
    }
}, {
    // Añadir la propiedad indexes para crear un índice único compuesto
    indexes: [
        {
            unique: true,
            fields: ['scheduleId', 'activityId']
        }
    ]
});

module.exports = ActivitySchedule;