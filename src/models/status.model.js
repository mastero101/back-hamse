const { Sequelize, sequelize } = require('../config/database');

const Status = sequelize.define('Status', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    state: {
        type: Sequelize.ENUM('verified', 'not_applicable', 'unchecked'),
        defaultValue: 'unchecked'
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