// En el archivo de migración generado (ej: XXXXXX-modify-status-enum.js)
'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    // Primero, elimina el defaultValue anterior si existe y usa el ENUM
    await queryInterface.sequelize.query(`
      ALTER TABLE "Statuses" ALTER COLUMN "state" DROP DEFAULT;
    `);
    // Añade los nuevos valores al ENUM existente
    await queryInterface.sequelize.query(`
      ALTER TYPE "public"."enum_Statuses_state" ADD VALUE IF NOT EXISTS 'pending';
    `);
    await queryInterface.sequelize.query(`
      ALTER TYPE "public"."enum_Statuses_state" ADD VALUE IF NOT EXISTS 'completed';
    `);
     // Opcional: Eliminar valores antiguos si ya no se usan (¡CUIDADO!)
     // await queryInterface.sequelize.query(`ALTER TYPE "public"."enum_Statuses_state" RENAME VALUE 'unchecked' TO 'pending';`); // Ejemplo si quieres renombrar
     // await queryInterface.sequelize.query(`ALTER TYPE "public"."enum_Statuses_state" RENAME VALUE 'verified' TO 'completed';`); // Ejemplo si quieres renombrar

    // Vuelve a establecer el defaultValue con el nuevo valor predeterminado
     await queryInterface.sequelize.query(`
       ALTER TABLE "Statuses" ALTER COLUMN "state" SET DEFAULT 'pending';
     `);
  },

  async down (queryInterface, Sequelize) {
    // Revertir los cambios es complejo con ENUMs.
    // Podrías intentar eliminar los valores, pero puede fallar si están en uso.
    // O revertir al estado anterior si lo conoces.
    // Por simplicidad, a menudo se deja vacío o se añade un comentario.
    console.log("Revertir la modificación del ENUM 'enum_Statuses_state' requiere pasos manuales o una lógica compleja.");
  }
};