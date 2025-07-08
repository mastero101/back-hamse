'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Requirements', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      dependency: { type: Sequelize.STRING, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      periodicity: { type: Sequelize.STRING, allowNull: true },
      period: { type: Sequelize.STRING, allowNull: true },
      completed: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      videoUrl: { type: Sequelize.STRING, allowNull: true },
      hasProvidersButton: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      respaldo: { type: Sequelize.TEXT, allowNull: true },
      reminderDates: { type: Sequelize.ARRAY(Sequelize.DATE), allowNull: true, defaultValue: [] },
      providers: { type: Sequelize.JSONB, allowNull: true, defaultValue: [] },
      subTitle: { type: Sequelize.STRING, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Requirements');
  }
};
