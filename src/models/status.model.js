const { Sequelize, sequelize } = require('../config/database');

const Status = sequelize.define('Status', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    state: {
        type: Sequelize.ENUM('pending', 'completed', 'not_applicable'),
        allowNull: false,
        defaultValue: 'pending'
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
    },
    scheduleId: {
        type: Sequelize.UUID,
        allowNull: true, // Changed from false to true to match migration result
        references: {
            model: 'Schedules',
            key: 'id'
        }
        // Removed onDelete and onUpdate here as they are better handled by the migration/database constraint
    }
});

module.exports = Status;