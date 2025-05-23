'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const defaultVideoUrl = 'https://www.youtube.com/embed/LV6M1GK4Fsw'; // URL de video por defecto para embed

    const defaultRequirements = [
      // PCIVIL
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'PCIVIL', title: 'Programa Interno de Protección Civil', description: 'Implementación del Programa Interno de Protección Civil y los requisitos que deben cumplir en materia de protección civil, llenado y seguimiento a los formatos requeridos. En caso de haber requerimientos de visitas, anexar la evidencia de la solventación sellada por la secretaría.', periodicity: 'Anual', period: 'Enero a Diciembre', completed: false, videoUrl: defaultVideoUrl, hasProvidersButton: false, createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'PCIVIL', title: 'Anuencia', description: 'Solicitar la anuencia municipal presentando el PIPC y demás documentos que solicite el ayuntamiento.', periodicity: 'Anual', period: 'Enero a Diciembre', completed: false, videoUrl: defaultVideoUrl, hasProvidersButton: false, createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'PCIVIL', title: 'Cursos de Protección Civil', description: 'Capacitación de: Primeros Auxilios, Evacuación de Inmuebles, Búsqueda y Rescate y Combate de Incendios. Obtener las constancias.', periodicity: 'Anual', period: 'Enero a Diciembre', completed: false, videoUrl: defaultVideoUrl, hasProvidersButton: false, createdAt: new Date(), updatedAt: new Date() },

      // ASEA
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'ASEA', title: 'Auditoria externa SASISOPA', description: 'Se realiza auditoría al SASISOPA por un tercero acreditado.', periodicity: 'Cada 2 años', period: 'De acuerdo a la estación', completed: false, hasProvidersButton: true, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'ASEA', title: 'Análisis de Riesgos del Sector Hidrocarburos', description: 'La estación de servicio deberá de contar con su Análisis de Riesgos del Sector Hidrocarburos para identificar los peligros, jerarquizar los riesgos y establecer las salvaguardas o recomendaciones para mitigar los peligros y disminuir el riesgo.', periodicity: 'Única', period: '-----', completed: false, hasProvidersButton: true, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'ASEA', title: 'Protocolo de Respuesta a Emergencias', description: 'La estación de servicio deberá de contar con su Protocolo de Respuesta a Emergencias actualizado conforme los establecido en DISPOSICIONES Administrativas de carácter general que establecen los Lineamientos para la elaboración de los protocolos de respuesta a emergencias.', periodicity: 'Única', period: '-----', completed: false, hasProvidersButton: true, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'ASEA', title: 'Dictamen de Operación y Mantenimiento - NOM 005 ASEA 2016', description: 'La estación de servicio deber contar con el dictamen de verificación para la etapa de operación y mantenimiento conforme a lo establecido en la NOM 005 ASEA 2016, el cual debe ser emitido por una Unidad de Verificación acreditada por la EMA y aprobada por la ASEA.', periodicity: 'Anual', period: 'Antes del vencimiento del ultimo dictamen', completed: false, hasProvidersButton: true, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },

      // STPS
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'STPS', title: 'NOM-020-STPS-2011 Recipientes Sujetos a Presión', description: 'Se definen las actividades de mantenimiento e inspección de los recipientes.', periodicity: 'Anual', period: 'Enero a Diciembre', completed: false, hasProvidersButton: true, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'STPS', title: 'NOM-022-STPS-2008 Electricidad Estática', description: 'Se define la resistencia de las tierras físicas.', periodicity: 'Anual', period: 'Enero a Diciembre', completed: false, hasProvidersButton: true, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'STPS', title: 'NOM-025-STPS-2008 Estudios de iluminación', description: 'Se realiza estudio para comprobar si cumple con la iluminación.', periodicity: 'Anual', period: 'Enero a Diciembre', completed: false, hasProvidersButton: true, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },

      // PROFECO
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'PROFECO', title: 'NOM-005-SCFI-2017 Instrumentos de Medición', description: 'Verificación del Sistema de Medición para el despacho de Gasolinas y Diesel.', periodicity: 'Semestral', period: '1.-Enero a marzo\n2.- Julio a Septiembre', completed: false, hasProvidersButton: false, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'PROFECO', title: 'NOM-022-STPS-2008 Electricidad Estática', description: 'Verificar el proveedor de Software cumple con lo requerido por DGN.', periodicity: 'Anual', period: 'Enero a Diciembre', completed: false, hasProvidersButton: false, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'PROFECO', title: 'NOM-025-STPS-2008 Estudios de iluminación', description: 'Bitácoras de movimientos de los dispensarios, de acuerdo a la Nom 005_ hojas de control.\n\nCuando se acceda a la programación, se abra el dispensario, cambio de precios.', periodicity: 'Permanente', period: 'Por evento', completed: false, hasProvidersButton: true, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },

      // CNE
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'CNE', title: 'Muestreo y Análisis conforme a la NOM-016-CRE-2016', description: 'Se realiza la toma de muestras y análisis por un Laboratorio. Se realiza la toma de muestras y análisis por un Laboratorio de acuerdo con la Ley Federal sobre Metrología y Normalización. Resguardo de los resultados de las pruebas de laboratorio efectuados en el primer y segundo semestre del año. (Pemex o externo acreditado)', periodicity: 'Semestral', period: '1.-Enero a Junio\n2.- Julio a Diciembre', completed: false, hasProvidersButton: false, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'CNE', title: 'Dictamen de cumplimiento vigente de la Norma Oficial Mexicana NOM-016-CRE-2016', description: 'Dictamen vigente de la Norma Oficial Mexicana NOM-016-CRE-2016, Especificaciones de calidad de los petrolíferos, emitido por una Unidad de Verificación acreditada por la EMA y aprobada por la ASEA.', periodicity: 'Anual', period: 'Enero a Marzo', completed: false, hasProvidersButton: true, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'CNE', title: 'Certificación del Manual del Sistema de Gestión de Medición (SGM)', description: 'Manual del Sistema de Gestión de las Mediciones, el cual debe contener los procedimientos y registros de las actividades en relación a los sistemas de medición. En caso de haberse dictaminado, Dictamen del SMG.El manual debe describir la organización del SGM y las generalidades de su operación.', periodicity: 'Anual', period: 'Enero a febrero o Diciembre', completed: false, hasProvidersButton: true, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },

      // SENER
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'SENER', title: 'Estudio de Evaluación de Impacto Social (EVIS)', description: 'En caso de cambios en las capacidades de la estación, se tendrá que volver a solicitar. Se requiere para el inicio de operaciones.', periodicity: 'Único', period: 'Eventual', completed: false, hasProvidersButton: false, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'SENER', title: 'Dictamen de cumplimiento vigente de la Norma Oficial Mexicana NOM-016-CRE-2016', description: 'Se evalúan las instalaciones eléctricas de la estación y se emite un dictamen de cumplimiento.', periodicity: 'Lustro', period: 'Cada 5 años', completed: false, hasProvidersButton: true, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },

      // PEMEX
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'PEMEX', title: 'Fianzas', description: 'Fianzas para compra de Combustible', periodicity: 'Único', period: 'Eventual', completed: false, hasProvidersButton: false, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },

      // SIN-MUN
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'SIN-MUN', subTitle: 'SINATEC - SEMARNAT', title: 'Cédula de Operación Anual', description: 'Una vez que la estación de servicio cuenta con la resolución de la LAU o la LF, además de que las gasolineras están catalogadas como fuentes fijas de jurisdicción federal, deberán de presentar el trámite de la Cédula de Operación Anual y, posteriormente, su actualización anualmente.', periodicity: 'Anual', period: '1 de Marzo al 30 de Junio', completed: false, hasProvidersButton: true, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'SIN-MUN', subTitle: 'MUNICIPALES', title: 'Prediales', description: '', periodicity: 'Anual', period: 'Enero', completed: false, hasProvidersButton: false, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'SIN-MUN', subTitle: 'MUNICIPALES', title: 'Convenio Bomberos', description: '', periodicity: 'Anual', period: 'Previo al vencimiento', completed: false, hasProvidersButton: false, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'SIN-MUN', subTitle: 'MUNICIPALES', title: 'Anuencias de Preciador', description: '', periodicity: 'Anual', period: 'Enero', completed: false, hasProvidersButton: false, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },

      // SAT
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'SAT', title: 'Anexo 30', description: 'Establece los requisitos para la implementación de controles volumétricos en la industria de hidrocarburos y petrolíferos. Estos controles tienen como objetivo garantizar la precisión y transparencia en la medición de volúmenes, así como cumplir con las obligaciones fiscales y regulatorias.', periodicity: 'Anual', period: 'Diciembre', completed: false, hasProvidersButton: true, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('gen_random_uuid()'), dependency: 'SAT', title: 'Anexo 31', description: 'Describe el proceso de verificación y certificación de estos equipos y programas, garantizando que cumplan con las especificaciones del Anexo 30.', periodicity: 'Anual', period: 'Diciembre', completed: false, hasProvidersButton: true, videoUrl: defaultVideoUrl, createdAt: new Date(), updatedAt: new Date() },
    ];

    // Limpiar requerimientos existentes antes de volver a insertar
    await queryInterface.bulkDelete('Requirements', null, {});
    await queryInterface.bulkInsert('Requirements', defaultRequirements, {});

    console.log('Default dependency requirements seeded successfully');
  },

  async down (queryInterface, Sequelize) {
    // Lista completa y actualizada de nombres de requerimientos por dependencia
    const requirementNames = [
      // PCIVIL
      'Programa Interno de Protección Civil', 'Anuencia', 'Cursos de Protección Civil',
      // ASEA
      'Auditoria externa SASISOPA', 'Análisis de Riesgos del Sector Hidrocarburos', 'Protocolo de Respuesta a Emergencias', 'Dictamen de Operación y Mantenimiento - NOM 005 ASEA 2016',
      // STPS
      'NOM-020-STPS-2011 Recipientes Sujetos a Presión', 'NOM-022-STPS-2008 Electricidad Estática', 'NOM-025-STPS-2008 Estudios de iluminación',
      // PROFECO
      'NOM-005-SCFI-2017 Instrumentos de Medición', 'NOM-022-STPS-2008 Electricidad Estática', 'NOM-025-STPS-2008 Estudios de iluminación',
      // CNE
      'Muestreo y Análisis conforme a la NOM-016-CRE-2016', 'Dictamen de cumplimiento vigente de la Norma Oficial Mexicana NOM-016-CRE-2016', 'Certificación del Manual del Sistema de Gestión de Medición (SGM)',
      // SENER
      'Estudio de Evaluación de Impacto Social (EVIS)', 'Dictamen de cumplimiento vigente de la Norma Oficial Mexicana NOM-016-CRE-2016',
      // PEMEX
      'Fianzas',
      // SIN-MUN
      'Cédula de Operación Anual', 'Prediales', 'Convenio Bomberos', 'Anuencias de Preciador',
      // SAT
      'Anexo 30', 'Anexo 31',
    ];

    await queryInterface.bulkDelete('Requirements', {
      title: {
        [Sequelize.Op.in]: requirementNames
      }
    }, {});

    console.log('Default dependency requirements removed');
  }
};