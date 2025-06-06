const { Schedule, Activity, Status, User, ActivitySchedule } = require('../models'); // Importar ActivitySchedule
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const scheduleController = {
    create: async (req, res) => {
        const transaction = await sequelize.transaction(); // Iniciar transacción
        try {
            console.log('Creating schedule with body:', JSON.stringify(req.body, null, 2));
            const { activities, ...scheduleData } = req.body; // Separar actividades del resto de datos del schedule

            const existing = await Schedule.findOne({
                where: {
                    type: req.body.type,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    assignedTo: req.userId
                }
            });
            if (existing) {
                // Opcional: devolver el existente o lanzar error
                return res.status(200).json({ status: 'success', data: existing });
            }

            const schedule = await Schedule.create({
                ...scheduleData,
                assignedTo: req.userId
            }, { transaction });

            if (activities && Array.isArray(activities)) {
                const activityScheduleEntries = activities.map(activity => ({
                    activityId: activity.id,
                    scheduleId: schedule.id,
                    programStates: activity.checkedWeeks || activity.programStates || [] // Usar checkedWeeks o programStates
                }));

                console.log('Attempting to bulk create ActivitySchedule entries:', activityScheduleEntries);

                // Usar bulkCreate para insertar las entradas en la tabla intermedia
                await ActivitySchedule.bulkCreate(activityScheduleEntries, { transaction });
                console.log('Successfully created ActivitySchedule entries for schedule:', schedule.id);

            } else {
                console.log('No valid activities array found in request body for creation.');
            }

            await transaction.commit(); // Confirmar transacción

            // Devolver el schedule recién creado, incluyendo las actividades asociadas y sus programStates
            const createdScheduleWithDetails = await Schedule.findByPk(schedule.id, {
                 include: [
                     {
                         model: Activity,
                         through: { // Incluir datos de la tabla intermedia
                             model: ActivitySchedule,
                             attributes: ['programStates'] // Especificar el campo a incluir
                         },
                         // Opcional: Incluir Status si es necesario inmediatamente después de crear
                         // include: [{ model: Status, attributes: ['state', 'completedAt', 'notes'] }]
                     },
                     { model: User, attributes: ['id', 'username'] }
                 ]
             });

            return res.status(201).json({
                status: 'success',
                data: createdScheduleWithDetails
            });
        } catch (error) {
            await transaction.rollback(); // Revertir transacción en caso de error
            console.error('Error creating schedule:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    findAll: async (req, res) => {
        try {
            const schedules = await Schedule.findAll({
                include: [
                    {
                        model: Activity,
                        through: { // Incluir datos de la tabla intermedia
                            model: ActivitySchedule,
                            attributes: ['programStates'] // Especificar el campo a incluir
                        },
                        include: [{
                            model: Status,
                            required: false,
                            attributes: ['state', 'completedAt', 'notes', 'scheduleId', 'ActivityId']
                        }]
                    },
                    {
                        model: User,
                        attributes: ['id', 'username']
                    }
                ]
            });

            // Formatear la respuesta para incluir programStates directamente en la actividad
            const formattedSchedules = schedules.map(schedule => {
                const plainSchedule = schedule.get({ plain: true });
                if (plainSchedule.Activities) {
                    plainSchedule.Activities = plainSchedule.Activities.map(activity => {
                        // Mover programStates de la tabla intermedia al objeto actividad
                        const programStates = activity.ActivitySchedule ? activity.ActivitySchedule.programStates : [];
                        delete activity.ActivitySchedule; // Eliminar el objeto de la tabla intermedia si no se necesita
                        return {
                            ...activity,
                            programStates: programStates
                        };
                    });
                }
                return plainSchedule;
            });


            return res.json({
                status: 'success',
                data: formattedSchedules
            });
        } catch (error) {
            console.error('Error finding all schedules:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    findOne: async (req, res) => {
        try {
            const schedule = await Schedule.findByPk(req.params.id, {
                include: [
                    {
                        model: Activity,
                        through: { // Incluir datos de la tabla intermedia
                            model: ActivitySchedule,
                            attributes: ['programStates'] // Especificar el campo a incluir
                        },
                        include: [{
                            model: Status,
                            where: { scheduleId: req.params.id },
                            required: false,
                            attributes: ['state', 'completedAt', 'notes']
                        }]
                    },
                    {
                        model: User,
                        attributes: ['id', 'username']
                    }
                ]
            });

            if (!schedule) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Schedule not found'
                });
            }

            // Formatear la respuesta para incluir programStates directamente en la actividad
            const plainSchedule = schedule.get({ plain: true });
            if (plainSchedule.Activities) {
                plainSchedule.Activities = plainSchedule.Activities.map(activity => {
                    const programStates = activity.ActivitySchedule ? activity.ActivitySchedule.programStates : [];
                    delete activity.ActivitySchedule;
                    return {
                        ...activity,
                        programStates: programStates
                    };
                });
            }


            return res.json({
                status: 'success',
                data: plainSchedule
            });
        } catch (error) {
            console.error(`Error finding schedule ${req.params.id}:`, error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },


    update: async (req, res) => {
        const transaction = await sequelize.transaction(); // Iniciar transacción
        try {
            const schedule = await Schedule.findByPk(req.params.id, { transaction });

            if (!schedule) {
                await transaction.rollback();
                return res.status(404).json({
                    status: 'error',
                    message: 'Schedule not found'
                });
            }

            console.log(`Updating schedule ${req.params.id} with body:`, JSON.stringify(req.body, null, 2));
            const { activities, ...updateData } = req.body;

            // Actualizar campos del schedule
            await schedule.update(updateData, { transaction });

            if (activities && Array.isArray(activities)) {
                console.log('Attempting to update ActivitySchedule entries.');

                // Para actualizar la tabla intermedia, podemos eliminar las entradas existentes
                // y crear las nuevas, o actualizar individualmente.
                // Eliminar y recrear es más simple si la lista de actividades puede cambiar.
                // Si solo se actualizan los estados, actualizar individualmente es mejor.
                // Asumiremos que la lista de actividades asociadas no cambia drásticamente
                // y que solo se actualizan los programStates.

                const updatePromises = activities.map(async (activityUpdate) => {
                    // Encontrar la entrada existente en ActivitySchedule
                    const existingEntry = await ActivitySchedule.findOne({
                        where: {
                            scheduleId: schedule.id,
                            activityId: activityUpdate.id
                        },
                        transaction
                    });

                    if (existingEntry) {
                        // Actualizar el campo programStates
                        await existingEntry.update({
                            programStates: activityUpdate.checkedWeeks || activityUpdate.programStates || []
                        }, { transaction });
                        console.log(`Updated programStates for Activity ${activityUpdate.id} in Schedule ${schedule.id}`);
                    } else {
                        // Si la actividad no estaba asociada, crear una nueva entrada en ActivitySchedule
                        console.warn(`Activity ${activityUpdate.id} not found in ActivitySchedule for Schedule ${schedule.id}. Creating a new entry.`);
                        await ActivitySchedule.create({
                            scheduleId: schedule.id,
                            activityId: activityUpdate.id,
                            programStates: activityUpdate.checkedWeeks || activityUpdate.programStates || []
                        }, { transaction });
                         console.log(`Created new ActivitySchedule entry for Activity ${activityUpdate.id} in Schedule ${schedule.id}`);
                    }
                });

                await Promise.all(updatePromises);
                console.log('Successfully updated ActivitySchedule entries.');

            } else {
                console.log('No valid activities array found in request body for update.');
            }

            await transaction.commit(); // Confirmar transacción

            // Devolver el schedule actualizado con sus asociaciones (incluyendo programStates)
            const updatedSchedule = await Schedule.findByPk(req.params.id, {
                 include: [
                     {
                         model: Activity,
                         through: { // Incluir datos de la tabla intermedia
                             model: ActivitySchedule,
                             attributes: ['programStates'] // Especificar el campo a incluir
                         },
                         include: [{
                             model: Status,
                             where: { scheduleId: req.params.id },
                             required: false,
                             attributes: ['state', 'completedAt', 'notes']
                         }]
                     },
                     { model: User, attributes: ['id', 'username'] }
                 ]
             });

            // Formatear la respuesta para incluir programStates directamente en la actividad
            const plainUpdatedSchedule = updatedSchedule.get({ plain: true });
            if (plainUpdatedSchedule.Activities) {
                plainUpdatedSchedule.Activities = plainUpdatedSchedule.Activities.map(activity => {
                    const programStates = activity.ActivitySchedule ? activity.ActivitySchedule.programStates : [];
                    delete activity.ActivitySchedule;
                    return {
                        ...activity,
                        programStates: programStates
                    };
                });
            }

            return res.json({
                status: 'success',
                data: plainUpdatedSchedule
            });
        } catch (error) {
            await transaction.rollback(); // Revertir transacción en caso de error
            console.error(`Error updating schedule ${req.params.id}:`, error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    delete: async (req, res) => {
        try {
            const schedule = await Schedule.findByPk(req.params.id);

            if (!schedule) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Schedule not found'
                });
            }

            await schedule.destroy();

            return res.json({
                status: 'success',
                message: 'Schedule deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    updateProgress: async (req, res) => {
        // Este método ya parece calcular el progreso basado en los Status.
        // Si necesitas que también considere los programStates, la lógica aquí
        // debería ser ajustada. Por ahora, lo dejamos como está, asumiendo
        // que el progreso se basa en el Status general de la actividad dentro del schedule.
        try {
            const scheduleId = req.params.id;
            console.log(`[${new Date().toISOString()}] Manual progress update requested for schedule ${scheduleId}`);
            const schedule = await Schedule.findByPk(scheduleId);
            if (!schedule) {
                return res.status(404).json({ status: 'error', message: 'Schedule not found' });
            }

            // --- Copia/Refactoriza la lógica de cálculo de progreso aquí si es necesario ---
            // (Esta es la lógica que también está en updateActivityStatuses)
            const activities = await schedule.getActivities({
                include: [{
                    model: Status,
                    where: { scheduleId: scheduleId },
                    required: false
                }]
            });
            const totalActivities = activities.length;
            let completedCount = 0;
            let progress = 0;
            let scheduleStatus = schedule.status;

            if (totalActivities > 0) {
                activities.forEach(activity => {
                    const relevantStatus = activity.Statuses?.[0];
                    if (relevantStatus && relevantStatus.state === 'completed') {
                        completedCount++;
                    }
                });
                progress = Math.round((completedCount / totalActivities) * 100);

                if (progress === 100) {
                    scheduleStatus = 'completed';
                } else if (progress > 0) {
                    scheduleStatus = 'in_progress';
                } else { // progress === 0
                    scheduleStatus = 'pending';
                }
            } else {
                progress = 100; // O 0?
                scheduleStatus = 'completed'; // O 'pending'?
            }

            if (schedule.progress !== progress || schedule.status !== scheduleStatus) {
                console.log(`[${new Date().toISOString()}] Updating schedule ${scheduleId} progress to ${progress}% and status to ${scheduleStatus}.`);
                await schedule.update({ progress, status: scheduleStatus });
            } else {
                console.log(`[${new Date().toISOString()}] Schedule ${scheduleId} progress/status unchanged.`);
            }
            // --- Fin lógica cálculo ---

            return res.json({ status: 'success', data: { progress: schedule.progress, status: schedule.status } });
        } catch (error) {
             console.error(`[${new Date().toISOString()}] Error updating progress for schedule ${req.params.id}:`, error);
             return res.status(500).json({ status: 'error', message: error.message });
        }
    },


    // --- Nueva función ---
    updateActivityStatuses: async (req, res) => {
        const scheduleId = req.params.id;
        const statusUpdates = req.body.statuses; // Espera { statuses: [ { activityId: '...', state: '...' }, ... ] }

        // Log recibido
        console.log(`[${new Date().toISOString()}] Received PUT /schedules/${scheduleId}/statuses`);
        console.log(`Payload:`, JSON.stringify(req.body, null, 2));


        if (!Array.isArray(statusUpdates)) {
            console.error(`[${new Date().toISOString()}] Invalid input: statuses is not an array.`);
            return res.status(400).json({ status: 'error', message: 'Invalid input: statuses must be an array.' });
        }

        // Opcional: Manejar el caso de un array vacío si no se considera un error
        if (statusUpdates.length === 0) {
             console.warn(`[${new Date().toISOString()}] Received empty statuses array for schedule ${scheduleId}. No action taken.`);
             // Podrías devolver el estado actual del schedule si lo deseas
             const currentSchedule = await Schedule.findByPk(scheduleId, {
                 include: [
                     {
                         model: Activity,
                         through: { // Incluir datos de la tabla intermedia
                             model: ActivitySchedule,
                             attributes: ['programStates'] // Especificar el campo a incluir
                         },
                         include: [{ model: Status, where: { scheduleId: scheduleId }, required: false }]
                     },
                     { model: User, attributes: ['id', 'username'] }
                 ]
             });
             // Formatear la respuesta para incluir programStates directamente en la actividad
             const plainCurrentSchedule = currentSchedule ? currentSchedule.get({ plain: true }) : null;
             if (plainCurrentSchedule && plainCurrentSchedule.Activities) {
                 plainCurrentSchedule.Activities = plainCurrentSchedule.Activities.map(activity => {
                     const programStates = activity.ActivitySchedule ? activity.ActivitySchedule.programStates : [];
                     delete activity.ActivitySchedule;
                     return {
                         ...activity,
                         programStates: programStates
                     };
                 });
             }
             return res.json({ status: 'success', message: 'No status updates provided.', data: plainCurrentSchedule });
        }


        const transaction = await sequelize.transaction();
        console.log(`[${new Date().toISOString()}] Transaction started for schedule ${scheduleId}`);

        try {
            const schedule = await Schedule.findByPk(scheduleId, { transaction });
            if (!schedule) {
                await transaction.rollback();
                console.error(`[${new Date().toISOString()}] Schedule ${scheduleId} not found.`);
                return res.status(404).json({ status: 'error', message: 'Schedule not found' });
            }

            // Obtener IDs de las actividades actualmente asociadas al schedule para validación
            const associatedActivities = await schedule.getActivities({ attributes: ['id'], transaction });
            const associatedActivityIds = new Set(associatedActivities.map(a => a.id));
            console.log(`[${new Date().toISOString()}] Activities associated with schedule ${scheduleId}:`, Array.from(associatedActivityIds));


            const promises = statusUpdates.map(async (update) => {
                console.log(`[${new Date().toISOString()}] Processing update for Activity ${update.activityId}: state=${update.state}`);

                // 1. Validar que el Activity ID existe en la tabla Activities (opcional pero recomendado)
                //    y que está asociado a este schedule.
                if (!associatedActivityIds.has(update.activityId)) {
                    console.warn(`[${new Date().toISOString()}] Activity ${update.activityId} is not associated with Schedule ${scheduleId}. Skipping update.`);
                    // Podrías lanzar un error 400 aquí si quieres ser estricto
                    return; // Saltar esta actualización
                }

                // 2. Buscar o crear la entrada en la tabla Status para esta actividad y schedule
                const [statusEntry, created] = await Status.findOrCreate({
                    where: {
                        ActivityId: update.activityId,
                        scheduleId: scheduleId
                    },
                    defaults: {
                        state: update.state,
                        notes: update.notes || null,
                        completedAt: update.state === 'completed' ? new Date() : null,
                        verifiedBy: req.userId // Asignar el usuario que verifica
                    },
                    transaction
                });

                if (!created) {
                    // Si ya existía, actualizarla
                    await statusEntry.update({
                        state: update.state,
                        notes: update.notes || null,
                        completedAt: update.state === 'completed' ? new Date() : null,
                        verifiedBy: req.userId // Actualizar el usuario que verifica
                    }, { transaction });
                    console.log(`[${new Date().toISOString()}] Updated Status for Activity ${update.activityId} in Schedule ${scheduleId}`);
                } else {
                     console.log(`[${new Date().toISOString()}] Created Status for Activity ${update.activityId} in Schedule ${scheduleId}`);
                }

                // Opcional: Si updateActivityStatuses también debe manejar programStates,
                // aquí podrías buscar la entrada en ActivitySchedule y actualizarla.
                // Sin embargo, parece que programStates se maneja en el update general del schedule,
                // y Status maneja el estado de completitud. Mantendremos esta función enfocada en Status.

            });

            await Promise.all(promises);

            // Recalcular y actualizar el progreso del schedule después de actualizar los estados
            // Esta lógica es similar a la de updateProgress, podrías refactorizarla si se usa mucho.
            const activitiesWithUpdatedStatus = await schedule.getActivities({
                include: [{
                    model: Status,
                    where: { scheduleId: scheduleId },
                    required: false
                }],
                transaction // Usar la misma transacción
            });

            const totalActivities = activitiesWithUpdatedStatus.length;
            let completedCount = 0;
            let progress = 0;
            let scheduleStatus = schedule.status; // Mantener el estado actual por defecto

            if (totalActivities > 0) {
                activitiesWithUpdatedStatus.forEach(activity => {
                    const relevantStatus = activity.Statuses?.[0]; // Asumiendo que solo hay un Status por Activity/Schedule
                    if (relevantStatus && relevantStatus.state === 'completed') {
                        completedCount++;
                    }
                });
                progress = Math.round((completedCount / totalActivities) * 100);

                // Actualizar el estado del schedule basado en el progreso
                if (progress === 100) {
                    scheduleStatus = 'completed';
                } else if (progress > 0) {
                    scheduleStatus = 'in_progress';
                } else { // progress === 0
                    scheduleStatus = 'pending';
                }
            } else {
                 // Si no hay actividades, el schedule podría considerarse completado o pendiente dependiendo de la lógica de negocio
                 progress = 100; // O 0?
                 scheduleStatus = 'completed'; // O 'pending'?
            }

            // Solo actualizar si hay cambios
            if (schedule.progress !== progress || schedule.status !== scheduleStatus) {
                 console.log(`[${new Date().toISOString()}] Updating schedule ${scheduleId} progress to ${progress}% and status to ${scheduleStatus} after status updates.`);
                 await schedule.update({ progress, status: scheduleStatus }, { transaction });
            } else {
                 console.log(`[${new Date().toISOString()}] Schedule ${scheduleId} progress/status unchanged after status updates.`);
            }


            await transaction.commit(); // Confirmar transacción

            // Devolver el schedule actualizado con sus asociaciones (incluyendo Status y programStates)
            const updatedSchedule = await Schedule.findByPk(scheduleId, {
                 include: [
                     {
                         model: Activity,
                         through: { // Incluir datos de la tabla intermedia
                             model: ActivitySchedule,
                             attributes: ['programStates'] // Especificar el campo a incluir
                         },
                         include: [{
                             model: Status,
                             where: { scheduleId: scheduleId },
                             required: false,
                             attributes: ['state', 'completedAt', 'notes']
                         }]
                     },
                     { model: User, attributes: ['id', 'username'] }
                 ]
             });

            // Formatear la respuesta para incluir programStates directamente en la actividad
            const plainUpdatedSchedule = updatedSchedule.get({ plain: true });
            if (plainUpdatedSchedule.Activities) {
                plainUpdatedSchedule.Activities = plainUpdatedSchedule.Activities.map(activity => {
                    const programStates = activity.ActivitySchedule ? activity.ActivitySchedule.programStates : [];
                    delete activity.ActivitySchedule;
                    return {
                        ...activity,
                        programStates: programStates
                    };
                });
            }

            return res.json({
                status: 'success',
                message: 'Activity statuses and schedule progress updated successfully',
                data: plainUpdatedSchedule
            });

        } catch (error) {
            await transaction.rollback(); // Revertir transacción en caso de error
            console.error(`[${new Date().toISOString()}] Error updating activity statuses for schedule ${scheduleId}:`, error);
            return res.status(500).json({ status: 'error', message: error.message || 'Error al actualizar los estados de las actividades.' });
        }
    },

    findByDate: async (req, res) => {
        try {
            const { type, date } = req.query;
            const fechaReferencia = new Date(date);

            const schedule = await Schedule.findOne({
                where: {
                    type: type,
                    startDate: { [Op.lte]: fechaReferencia },
                    endDate: { [Op.gte]: fechaReferencia }
                },
                include: [
                    {
                        model: Activity,
                        through: { // Incluir datos de la tabla intermedia
                            model: ActivitySchedule,
                            attributes: ['programStates'] // Especificar el campo a incluir
                        },
                        include: [{
                            model: Status,
                            required: false,
                            attributes: ['state', 'completedAt', 'notes', 'scheduleId', 'ActivityId']
                        }]
                    },
                    {
                        model: User,
                        attributes: ['id', 'username']
                    }
                ]
            });

            if (!schedule) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Schedule not found'
                });
            }

            // Formatear la respuesta para incluir programStates directamente en la actividad
            const plainSchedule = schedule.get({ plain: true });
            if (plainSchedule.Activities) {
                plainSchedule.Activities = plainSchedule.Activities.map(activity => {
                    const programStates = activity.ActivitySchedule ? activity.ActivitySchedule.programStates : [];
                    delete activity.ActivitySchedule;
                    return {
                        ...activity,
                        programStates: programStates
                    };
                });
            }

            return res.json({
                status: 'success',
                data: plainSchedule
            });
        } catch (error) {
            console.error('Error finding schedule by date:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

module.exports = scheduleController;