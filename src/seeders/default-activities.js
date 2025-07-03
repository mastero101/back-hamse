'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const defaultActivities = [
        // --- Categoría: calendar ---

        // Frecuencia: daily ("Registro de Actividades diarias")
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE VÁLVULAS DE CORTE RÁPIDO EN MANGUERAS', frequency: 'daily', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'SEÑALAMIENTOS RESTRICTIVOS Y PREVENTIVOS', frequency: 'daily', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'SISTEMA DE TRATAMIENTO DE AGUAS RESIDUALES', frequency: 'daily', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DEL COMPRESOR', frequency: 'daily', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'BITÁCORA DE OPERACIÓN Y MANTENIMIENTO', frequency: 'daily', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE PISTOLAS DE DESPACHO', frequency: 'daily', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'LIMPIEZA DE TRAMPA DE COMBUSTIBLE', frequency: 'daily', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'FALDÓN PERIMETRAL PINTURA, LIMPIEZA E ILUMINACIÓN', frequency: 'daily', expectedDuration: 60, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'UNIFORMES Y CALZADO DE SEGURIDAD', frequency: 'daily', expectedDuration: 15, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },

        // Frecuencia: weekly ("Semanal")
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE FUGAS DE COMBUSTIBLE, AIRE Y AGUA', frequency: 'weekly', expectedDuration: 45, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'PRUEBA DE SENSORES DE LÍQUIDOS EN CONTENEDORES (TODOS)', frequency: 'weekly', expectedDuration: 60, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE SUMINISTRO DE AGUA Y AIRE', frequency: 'weekly', expectedDuration: 15, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE SANITARIOS', frequency: 'weekly', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN Y LIMPIEZA DE TERMINALES Y PEDESTALES', frequency: 'weekly', expectedDuration: 60, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN Y LIMPIEZA DE LA PLANTA DE EMERGENCIA', frequency: 'weekly', expectedDuration: 60, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },

        // Frecuencia: monthly ("Mensual")
        // Nota: Las actividades aquí listadas también aparecen en la imagen de "Diarias".
        // Se asume que para "calendar - monthly" son estas específicas.
        // Si una actividad debe existir tanto en daily como monthly para 'calendar', se necesitarían entradas duplicadas con diferente frecuencia.
        // Por ahora, se listan según la pestaña "Mensual" de Figma.
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE VÁLVULAS DE CORTE RÁPIDO EN MANGUERAS (Mensual)', frequency: 'monthly', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() }, // Nombre ajustado para diferenciar si es necesario
        { id: Sequelize.literal('gen_random_uuid()'), name: 'SEÑALAMIENTOS RESTRICTIVOS Y PREVENTIVOS (Mensual)', frequency: 'monthly', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'SISTEMA DE TRATAMIENTO DE AGUAS RESIDUALES (Mensual)', frequency: 'monthly', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DEL COMPRESOR (Mensual)', frequency: 'monthly', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'BITÁCORA DE OPERACIÓN Y MANTENIMIENTO (Mensual)', frequency: 'monthly', expectedDuration: 30, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },

        // Frecuencia: yearly ("Actividades Anuales 2025")
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE SELLOS EYS (TODOS)', frequency: 'yearly', expectedDuration: 120, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN Y LIMPIEZA DEL SISTEMA DE VENTEO DE TANQUES', frequency: 'yearly', expectedDuration: 120, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE ACCESORIOS DE TANQUES', frequency: 'yearly', expectedDuration: 60, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE TUBERÍAS DE COMBUSTIBLES EN GENERAL', frequency: 'yearly', expectedDuration: 60, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'LIMPIEZA DE SONDAS Y SUS FLOTADORES (ACTA DE HECHOS)', frequency: 'yearly', expectedDuration: 90, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'LIMPIEZA ECOLOGICA', frequency: 'yearly', expectedDuration: 180, category: 'calendar', createdAt: new Date(), updatedAt: new Date() },

        // --- Categoría: program ---
        // Frecuencia: weekly ("Cuadro de mantenimiento 2025" y confirmación del usuario)
        { id: Sequelize.literal('gen_random_uuid()'), name: 'PRUEBA DE VÁLVULAS SHUT-OFF DE DISPENSARIOS (TODAS)', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE VÁLVULAS DE CORTE RÁPIDO EN MANGUERAS (Programa)', frequency: 'weekly', expectedDuration: 30, category: 'program', createdAt: new Date(), updatedAt: new Date() }, 
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE FUGAS DE COMBUSTIBLE, AIRE Y AGUA (Programa)', frequency: 'weekly', expectedDuration: 45, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'LIMPIEZA DE SONDAS Y SUS FLOTADORES (ACTA DE HECHOS) (Programa)', frequency: 'weekly', expectedDuration: 90, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE SUMINISTRO DE AGUA Y AIRE (Programa)', frequency: 'weekly', expectedDuration: 15, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE SANITARIOS (Programa)', frequency: 'weekly', expectedDuration: 30, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN Y LIMPIEZA DE TERMINALES Y PEDESTALES (Programa)', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE CAJAS DE CONEXIÓN A PRUEBA DE EXPLOSIÓN', frequency: 'weekly', expectedDuration: 45, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE TUBERÍAS CONDUIT CEDULA 40', frequency: 'weekly', expectedDuration: 30, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'COPLES FLEXIBLES A PRUEBA DE EXPLOSIÓN (TODOS)', frequency: 'weekly', expectedDuration: 45, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'PRUEBA GENERAL DE PAROS DE EMERGENCIA (TODOS)(ACTA DE HECHOS)', frequency: 'weekly', expectedDuration: 120, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'REVISIÓN Y AGITADO DE EXTINTORES (TODOS)', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() }, // Nombre corregido
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE CONTENEDORES DE MOTOBOMBAS Y ACCESORIOS', frequency: 'weekly', expectedDuration: 45, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE ACCESORIOS DE TANQUES (Programa)', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE TUBERÍAS DE COMBUSTIBLES EN GENERAL (Programa)', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        // --- Agregadas desde la tabla de la imagen ---
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE SELLOS EYS (TODOS)', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE CAJAS DE CONEXIÓN A PRUEBA DE EXPLOSIÓN', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE TUBERÍAS CONDUIT CEDULA 40', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'COPLES FLEXIBLES A PRUEBA DE EXPLOSIÓN (TODOS)', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'PRUEBA GENERAL DE PAROS DE EMERGENCIA (TODOS)(ACTA DE HECHOS)', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'TIERRAS FÍSICAS EN MOTORES, DISPENSARIOS, MOTOBOMBAS, ESTRUCTURA, VENTEOS, TABLEROS ELÉCTRICO, REGISTROS DE TIERRAS, PEDESTALES, COMPRESOR, ETC.', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'REVISIÓN Y AGITADO DE EXTINTORES (TODOS)', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'PRUEBA DE LOS DETECTORES DE FUGAS', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'LIMPIEZA DE SONDAS (ACTA DE HECHOS)', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE CONTENEDORES DE MOTOBOMBAS Y ACCESORIOS', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE CONTENEDORES DE DISPENSARIOS Y ACCESORIOS', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE ALUMBRADO GENERAL', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE SUMINISTRO DE AGUA Y AIRE', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE SANITARIOS', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'PROGRAMA INTERNO DE PROTECCIÓN CIVIL', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'PUBLICIDAD EN ÁREAS DE ACUERDO A ESPECIFICACIONES', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'SEÑALAMIENTOS INFORMATIVOS', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'MEDIOS PUBLICITARIOS EN DISPENSARIOS Y/O BARDAS ACORDE A ESPECIFICACIONES', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE CONECTORES RÁPIDOS DE MANGUERA DE DESCARGA', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DEL CODO DE DESCARGA', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'TANQUES DE ALMACENAMIENTO DE ACUERDO A ESPECIFICACIONES', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'SISTEMA DE RECUPERACIÓN DE VAPORES Y VENTEOS DE TANQUES', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'TUBERÍAS DE COMBUSTIBLES DE ACUERDO A ESPECIFICACIONES', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'POZOS DE OBSERVACIÓN O MONITOREO PARA DETECCIÓN DE FUGAS', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'LIMPIEZA DE REGISTROS DEL DRENAJE ACEITOSO', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'DRENADO DE TANQUES (PURGA) (ACTA DE HECHOS)', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'CAMBIO DE FILTROS DE DISPENSARIOS', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'CAMBIO O LIMPIEZA DE CEDAZO DE DISPENSARIOS', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'CAMBIO DE ACEITE DEL COMPRESOR', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'MANTENIMIENTO Y LIMPIEZA DE CANALETAS DE TECHUMBRE', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'MANTENIMIENTO A VERIFONES Y PEDESTALES', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICACIÓN DE COMPONENTES ELÉCTRICOS', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICAR CALIBRACIÓN DE DISPENSARIOS', frequency: 'monthly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
        { id: Sequelize.literal('gen_random_uuid()'), name: 'VERIFICAR PLANTA DE EMERGENCIA', frequency: 'weekly', expectedDuration: 60, category: 'program', createdAt: new Date(), updatedAt: new Date() },
    ];

    // Limpiar actividades existentes antes de volver a insertar
    await queryInterface.bulkDelete('Activities', null, {});
    await queryInterface.bulkInsert('Activities', defaultActivities, {});

    console.log('Default activities (calendar and program) seeded successfully');
  },

  async down (queryInterface, Sequelize) {
    // Lista completa y actualizada de nombres de actividades 
    const activityNames = [
      // Calendar - daily
      'VERIFICACIÓN DE VÁLVULAS DE CORTE RÁPIDO EN MANGUERAS',
      'SEÑALAMIENTOS RESTRICTIVOS Y PREVENTIVOS',
      'SISTEMA DE TRATAMIENTO DE AGUAS RESIDUALES',
      'VERIFICACIÓN DEL COMPRESOR',
      'BITÁCORA DE OPERACIÓN Y MANTENIMIENTO',
      'VERIFICACIÓN DE PISTOLAS DE DESPACHO',
      'LIMPIEZA DE TRAMPA DE COMBUSTIBLE',
      'FALDÓn PERIMETRAL PINTURA, LIMPIEZA E ILUMINACIÓN',
      'UNIFORMES Y CALZADO DE SEGURIDAD',
      // Calendar - weekly
      'VERIFICACIÓN DE FUGAS DE COMBUSTIBLE, AIRE Y AGUA',
      'PRUEBA DE SENSORES DE LÍQUIDOS EN CONTENEDORES (TODOS)',
      'VERIFICACIÓN DE SUMINISTRO DE AGUA Y AIRE',
      'VERIFICACIÓN DE SANITARIOS',
      'VERIFICACIÓN Y LIMPIEZA DE TERMINALES Y PEDESTALES',
      'VERIFICACIÓN Y LIMPIEZA DE LA PLANTA DE EMERGENCIA',
      // Calendar - monthly
      'VERIFICACIÓN DE VÁLVULAS DE CORTE RÁPIDO EN MANGUERAS (Mensual)',
      'SEÑALAMIENTOS RESTRICTIVOS Y PREVENTIVOS (Mensual)',
      'SISTEMA DE TRATAMIENTO DE AGUAS RESIDUALES (Mensual)',
      'VERIFICACIÓN DEL COMPRESOR (Mensual)',
      'BITÁCORA DE OPERACIÓN Y MANTENIMIENTO (Mensual)',
      // Calendar - yearly
      'VERIFICACIÓN DE SELLOS EYS (TODOS)',
      'VERIFICACIÓN Y LIMPIEZA DEL SISTEMA DE VENTEO DE TANQUES',
      'VERIFICACIÓN DE ACCESORIOS DE TANQUES',
      'VERIFICACIÓN DE TUBERÍAS DE COMBUSTIBLES EN GENERAL',
      'LIMPIEZA DE SONDAS Y SUS FLOTADORES (ACTA DE HECHOS)',
      'LIMPIEZA ECOLOGICA',
      // Program - weekly
      'PRUEBA DE VÁLVULAS SHUT-OFF DE DISPENSARIOS (TODAS)',
      'VERIFICACIÓN DE VÁLVULAS DE CORTE RÁPIDO EN MANGUERAS (Programa)',
      'VERIFICACIÓN DE FUGAS DE COMBUSTIBLE, AIRE Y AGUA (Programa)',
      'LIMPIEZA DE SONDAS Y SUS FLOTADORES (ACTA DE HECHOS) (Programa)',
      'VERIFICACIÓN DE SUMINISTRO DE AGUA Y AIRE (Programa)',
      'VERIFICACIÓN DE SANITARIOS (Programa)',
      'VERIFICACIÓN Y LIMPIEZA DE TERMINALES Y PEDESTALES (Programa)',
      'VERIFICACIÓN DE CAJAS DE CONEXIÓN A PRUEBA DE EXPLOSIÓN',
      'VERIFICACIÓN DE TUBERÍAS CONDUIT CEDULA 40',
      'COPLES FLEXIBLES A PRUEBA DE EXPLOSIÓN (TODOS)',
      'PRUEBA GENERAL DE PAROS DE EMERGENCIA (TODOS)(ACTA DE HECHOS)',
      'REVISIÓN Y AGITADO DE EXTINTORES (TODOS)',
      'VERIFICACIÓN DE CONTENEDORES DE MOTOBOMBAS Y ACCESORIOS',
      'VERIFICACIÓN DE ACCESORIOS DE TANQUES (Programa)',
      'VERIFICACIÓN DE TUBERÍAS DE COMBUSTIBLES EN GENERAL (Programa)',
    ];

    await queryInterface.bulkDelete('Activities', {
      name: {
        [Sequelize.Op.in]: activityNames
      }
    }, {});

    console.log('Default activities (calendar and program) removed');
  }
};