'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const defaultActivities = [
        // Categoría: program
        { id: Sequelize.literal('gen_random_uuid()'), name: 'PRUEBA DE VÁLVULAS SHUT-OFF DE DISPENSARIOS ( TODAS )', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE VÁLVULAS DE CORTE RÁPIDO EN MANGUERAS', frequency: 'weekly', expectedDuration: 30, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE FUGAS DE COMBUSTIBLE, AIRE Y AGUA', frequency: 'weekly', expectedDuration: 45, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'LIMPIEZA DE SONDAS Y SUS FLOTADORES ( ACTA DE HECHOS)', frequency: 'monthly', expectedDuration: 90, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE SUMINISTRO DE AGUA Y AIRE', frequency: 'weekly', expectedDuration: 15, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE SANITARIOS', frequency: 'weekly', expectedDuration: 30, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN Y LIMPIEZA DE TERMINALES Y PEDESTALES', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE CAJAS DE CONEXIÓN A PRUEBA DE EXPLOSIÓN', frequency: 'monthly', expectedDuration: 45, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE TUBERÍAS CONDUIT CEDULA 40', frequency: 'monthly', expectedDuration: 30, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'COPLES FLEXIBLES A PRUEBA DE EXPLOSIÓN ( TODOS )', frequency: 'monthly', expectedDuration: 45, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'PRUEBA GENERAL DE PAROS DE EMERGENCIA ( TODOS )(ACTA DE HECHOS)', frequency: 'monthly', expectedDuration: 120, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'REVISIÓN Y ARITADO DE EXTINTORES ( TODOS )', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE CONTENEDORES DE MOTOBOMBAS Y ACCESORIOS', frequency: 'monthly', expectedDuration: 45, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE ACCESORIOS DE TANQUES', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE TUBERÍAS DE COMBUSTIBLES EN GENERAL', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        // Categoría: calendar
        { id: Sequelize.literal('gen_random_uuid()'), name: 'SEÑALAMIENTOS RESTRICTIVOS Y PREVENTIVOS', frequency: 'monthly', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'SISTEMA DE TRATAMIENTO DE AGUAS RESIDUALES', frequency: 'monthly', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DEL COMPRESOR', frequency: 'monthly', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'BITÁCORA DE OPERACIÓN Y MANTENIMIENTO', frequency: 'monthly', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE PISTOLAS DE DESPACHO', frequency: 'monthly', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'LIMPIEZA DE TRAMPA DE COMBUSTIBLE', frequency: 'monthly', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() }
    ];

    // Limpiar actividades existentes antes de volver a insertar
    await queryInterface.bulkDelete('Activities', null, {});

    await queryInterface.bulkInsert('Activities', defaultActivities, {});

    console.log('Default activities (with categories program/calendar) seeded successfully.');
  },

  async down (queryInterface, Sequelize) {
    // La función down actual que elimina por nombre está bien.
    const activityNames = [
      // Originales (program)
      'PRUEBA DE VÁLVULAS SHUT-OFF DE DISPENSARIOS ( TODAS )',
      'VERIFICACIÓN DE VÁLVULAS DE CORTE RÁPIDO EN MANGUERAS',
      'VERIFICACIÓN DE FUGAS DE COMBUSTIBLE, AIRE Y AGUA',
      'LIMPIEZA DE SONDAS Y SUS FLOTADORES ( ACTA DE HECHOS)',
      'VERIFICACIÓN DE SUMINISTRO DE AGUA Y AIRE',
      'VERIFICACIÓN DE SANITARIOS',
      'VERIFICACIÓN Y LIMPIEZA DE TERMINALES Y PEDESTALES',
      'VERIFICACIÓN DE CAJAS DE CONEXIÓN A PRUEBA DE EXPLOSIÓN',
      'VERIFICACIÓN DE TUBERÍAS CONDUIT CEDULA 40',
      'COPLES FLEXIBLES A PRUEBA DE EXPLOSIÓN ( TODOS )',
      'PRUEBA GENERAL DE PAROS DE EMERGENCIA ( TODOS )(ACTA DE HECHOS)',
      'REVISIÓN Y ARITADO DE EXTINTORES ( TODOS )',
      'VERIFICACIÓN DE CONTENEDORES DE MOTOBOMBAS Y ACCESORIOS',
      'VERIFICACIÓN DE ACCESORIOS DE TANQUES',
      'VERIFICACIÓN DE TUBERÍAS DE COMBUSTIBLES EN GENERAL',
      // Nuevas (calendar)
      'SEÑALAMIENTOS RESTRICTIVOS Y PREVENTIVOS',
      'SISTEMA DE TRATAMIENTO DE AGUAS RESIDUALES',
      'VERIFICACIÓN DEL COMPRESOR',
      'BITÁCORA DE OPERACIÓN Y MANTENIMIENTO',
      'VERIFICACIÓN DE PISTOLAS DE DESPACHO',
      'LIMPIEZA DE TRAMPA DE COMBUSTIBLE'
    ];

    await queryInterface.bulkDelete('Activities', {
      name: {
        [Sequelize.Op.in]: activityNames
      }
    }, {});

    console.log('Default activities (program/calendar) removed.');
  }
};