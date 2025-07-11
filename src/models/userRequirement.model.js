const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserRequirement = sequelize.define('UserRequirement', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    requirementId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Requirements',
        key: 'id'
      }
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    reminderDates: {
      type: DataTypes.ARRAY(DataTypes.DATE),
      defaultValue: []
    },
    respaldo: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    tableName: 'UserRequirements',
    timestamps: true
  });

  return UserRequirement;
}; 