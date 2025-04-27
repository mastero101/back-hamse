const { Sequelize, sequelize } = require('../config/database');

const Status = sequelize.define('Status', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    state: {
        type: Sequelize.ENUM('pending', 'completed', 'not_applicable'), // <-- Valores actualizados
        allowNull: false, // Es buena práctica asegurar que no sea nulo
        defaultValue: 'pending' // <-- Actualizar defaultValue si 'pending' es el nuevo estado inicial
    },
    completedAt: {
        type: Sequelize.DATE
    },
    notes: {
        type: Sequelize.TEXT
    },
    verifiedBy: {
        type: Sequelize.UUID,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
});

module.exports = Status;