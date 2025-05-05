const { Sequelize, sequelize } = require('../config/database');

const Setting = sequelize.define('Setting', {
    key: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    value: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    timestamps: true // Añade createdAt y updatedAt
});

module.exports = Setting;