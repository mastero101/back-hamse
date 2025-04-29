'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the column already exists to make the migration idempotent
    const tableInfo = await queryInterface.describeTable('Statuses');
    if (!tableInfo.scheduleId) {
      console.log('Adding scheduleId column to Statuses table...');
      await queryInterface.addColumn('Statuses', 'scheduleId', {
        type: Sequelize.UUID,
        allowNull: true, // Start with NULL allowed as we cannot populate existing rows reliably
        references: {
          model: 'Schedules', // Make sure 'Schedules' is the correct table name
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Consider SET NULL or RESTRICT if CASCADE delete is too aggressive
      });
      console.log('scheduleId column added successfully. Existing rows will have NULL.');

      // --- Population and NOT NULL constraint steps removed ---
      // We cannot reliably determine the scheduleId for existing statuses from Activities table.
      // You might need a separate script or manual update if population is required.
      // The column remains nullable for now.

    } else {
      console.log('Column scheduleId already exists in Statuses table. Migration step skipped.');
      // If needed, you could add logic here to ensure the existing column has the correct properties (e.g., references)
      // await queryInterface.changeColumn('Statuses', 'scheduleId', { /* desired properties */ });
    }
  },

  async down(queryInterface, Sequelize) {
    // Only remove the column if it exists
    const tableInfo = await queryInterface.describeTable('Statuses');
    if (tableInfo.scheduleId) {
      console.log('Removing scheduleId column from Statuses table...');
      await queryInterface.removeColumn('Statuses', 'scheduleId');
      console.log('scheduleId column removed.');
    } else {
       console.log('Column scheduleId does not exist in Statuses table, skipping removal.');
    }
  }
};