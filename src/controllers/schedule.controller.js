const { Schedule, Activity, Status, User } = require('../models'); // Keep model imports
const { sequelize } = require('../config/database'); // Import sequelize directly from its config file (adjust path if needed)

const scheduleController = {
    create: async (req, res) => {
        try {
            console.log('Creating schedule with body:', JSON.stringify(req.body, null, 2)); // Log para ver el body recibido
            const schedule = await Schedule.create({
                ...req.body,
                assignedTo: req.userId
            });

            if (req.body.activities && Array.isArray(req.body.activities)) {
                // Extraer solo los IDs de las actividades
                const activityIds = req.body.activities.map(activity => activity.id);
                console.log('Attempting to set activities with IDs:', activityIds); // Log para ver los IDs
                try {
                    // Pasar solo los IDs a setActivities
                    await schedule.setActivities(activityIds);
                    console.log('Successfully set activities for schedule:', schedule.id); // Log de éxito
                } catch (assocError) {
                    console.error('Error setting activities:', assocError); // Log si setActivities falla
                    // Considerar si el error debe detener la creación o solo registrarse
                }
            } else {
                console.log('No valid activities array found in request body.'); // Log si no hay activities
            }

            // Devolver el schedule recién creado, incluyendo las actividades asociadas
            const createdScheduleWithActivities = await Schedule.findByPk(schedule.id, {
                 include: [
                     {
                         model: Activity,
                         // Opcional: Incluir Status si es necesario inmediatamente después de crear
                         // include: [{ model: Status, attributes: ['state', 'completedAt', 'notes'] }]
                     },
                     { model: User, attributes: ['id', 'username'] }
                 ]
             });

            return res.status(201).json({
                status: 'success',
                data: createdScheduleWithActivities // Devolver con actividades
            });
        } catch (error) {
            console.error('Error creating schedule:', error); // Log del error general
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
                        through: { attributes: [] },
                        include: [{ // <-- Añadir inclusión de Status aquí
                            model: Status,
                            // Filtrar Status por el scheduleId actual si es necesario
                            // where: { scheduleId: Sequelize.col('Schedule.id') }, // Puede requerir ajustes
                            required: false, // Left join para incluir actividades sin estado aún
                            attributes: ['state', 'completedAt', 'notes', 'scheduleId', 'ActivityId'] // Especifica los atributos que necesitas
                        }]
                    },
                    {
                        model: User,
                        attributes: ['id', 'username']
                    }
                ]
            });

            // Opcional: Procesar para asegurar que solo se muestre el Status relevante por schedule
            // Esto puede ser complejo y es mejor manejarlo en la consulta si es posible
            // o filtrar en el frontend/backend después de la consulta.

            return res.json({
                status: 'success',
                data: schedules
            });
        } catch (error) {
            console.error('Error finding all schedules:', error); // Log de error
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
                        include: [{
                            model: Status,
                            where: { scheduleId: req.params.id }, // Filtrar Status por este scheduleId
                            required: false, // Left join para incluir actividades sin estado para este schedule
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

            return res.json({
                status: 'success',
                data: schedule
            });
        } catch (error) {
            console.error(`Error finding schedule ${req.params.id}:`, error); // Log de error
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },


    update: async (req, res) => {
        try {
            const schedule = await Schedule.findByPk(req.params.id);

            if (!schedule) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Schedule not found'
                });
            }

            console.log(`Updating schedule ${req.params.id} with body:`, JSON.stringify(req.body, null, 2)); // Log para ver el body
            // Actualizar campos del schedule excepto las actividades
            const { activities, ...updateData } = req.body;
            await schedule.update(updateData);

            if (activities && Array.isArray(activities)) {
                 // Extraer solo los IDs de las actividades
                const activityIds = activities.map(activity => activity.id);
                console.log('Attempting to set activities with IDs:', activityIds); // Log para ver los IDs
                try {
                     // Pasar solo los IDs a setActivities
                    await schedule.setActivities(activityIds);
                    console.log('Successfully set activities for schedule:', schedule.id); // Log de éxito
                } catch (assocError) {
                    console.error('Error setting activities during update:', assocError); // Log si setActivities falla
                     // Considerar si el error debe detener la actualización
                }
            } else {
                console.log('No valid activities array found in request body for update.'); // Log si no hay activities
            }

            // Devolver el schedule actualizado con sus asociaciones (incluyendo Status filtrado)
            const updatedSchedule = await Schedule.findByPk(req.params.id, {
                 include: [
                     {
                         model: Activity,
                         include: [{
                             model: Status,
                             where: { scheduleId: req.params.id }, // Filtrar Status por este scheduleId
                             required: false,
                             attributes: ['state', 'completedAt', 'notes']
                         }]
                     },
                     { model: User, attributes: ['id', 'username'] }
                 ]
             });
            return res.json({
                status: 'success',
                data: updatedSchedule // Devolver el schedule con las actividades y sus estados relevantes
            });
        } catch (error) {
            console.error(`Error updating schedule ${req.params.id}:`, error); // Log del error general
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
        // Asegúrate que este método también esté completo y correcto
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
                    scheduleStatus = 'pending'; // O mantener 'in_progress' si ya lo estaba? Decide la lógica.
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
                     { model: Activity, include: [{ model: Status, where: { scheduleId: scheduleId }, required: false }] },
                     { model: User, attributes: ['id', 'username'] }
                 ]
             });
             return res.json({ status: 'success', message: 'No status updates provided.', data: currentSchedule });
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
                const activity = await Activity.findByPk(update.activityId, { attributes: ['id'], transaction });
                 if (!activity) {
                     console.error(`[${new Date().toISOString()}] Validation Error: Activity ${update.activityId} not found.`);
                     throw new Error(`Activity with ID ${update.activityId} not found.`); // Esto causará un rollback y error 400/500
                 }

                // 2. Validar que esta Actividad está realmente asociada a este Schedule
                if (!associatedActivityIds.has(update.activityId)) {
                    console.error(`[${new Date().toISOString()}] Validation Error: Activity ${update.activityId} is not associated with schedule ${scheduleId}.`);
                    throw new Error(`Activity ${update.activityId} is not associated with schedule ${scheduleId}.`); // Causará rollback y error 400
                }

                // 3. Validar que el valor 'state' es uno de los permitidos por el ENUM del modelo Status
                const validStates = Status.getAttributes().state.values; // Obtener valores del ENUM dinámicamente
                if (!validStates.includes(update.state)) {
                    console.error(`[${new Date().toISOString()}] Validation Error: Invalid state value "${update.state}" for Activity ${update.activityId}. Valid states: ${validStates.join(', ')}`);
                    throw new Error(`Invalid state value: ${update.state}. Must be one of ${validStates.join(', ')}.`); // Causará rollback y error 400
                }


                // 4. Buscar un Status existente para esta combinación Schedule-Activity o crearlo si no existe
                const [status, created] = await Status.findOrCreate({
                    where: {
                        scheduleId: scheduleId,
                        ActivityId: update.activityId // Asume que la FK en Status es ActivityId (estándar de Sequelize)
                    },
                    defaults: {
                        state: update.state,
                        // Podrías añadir 'verifiedBy: req.userId' aquí si es relevante
                        completedAt: update.state === 'completed' ? new Date() : null // Establecer fecha si se completa
                    },
                    transaction
                });

                if (!created) {
                    // Si ya existía (found), actualizar su estado (y completedAt si es necesario)
                    if (status.state !== update.state) { // Solo actualizar si el estado cambió
                       console.log(`[${new Date().toISOString()}] Found existing status for Activity ${update.activityId}. Updating state from ${status.state} to ${update.state}.`);
                       await status.update({
                           state: update.state,
                           completedAt: update.state === 'completed' ? new Date() : null // Actualizar completedAt
                           // Podrías actualizar 'verifiedBy: req.userId' aquí también
                       }, { transaction });
                    } else {
                       console.log(`[${new Date().toISOString()}] Status for Activity ${update.activityId} already is ${update.state}. No update needed.`);
                    }
                } else {
                    console.log(`[${new Date().toISOString()}] Created new status for Activity ${update.activityId} with state ${update.state}.`);
                }
                return status; // Devolver el status encontrado o creado
            });

            // Esperar a que todas las operaciones de findOrCreate/update terminen
            await Promise.all(promises);
            console.log(`[${new Date().toISOString()}] All status updates processed successfully for schedule ${scheduleId}.`);


            // --- Recalcular Progreso y Estado del Schedule ---
            // Volver a obtener las actividades con sus estados *actualizados* dentro de la transacción
            const activitiesWithUpdatedStatus = await schedule.getActivities({
                include: [{
                    model: Status,
                    where: { scheduleId: scheduleId }, // Asegura que solo obtenemos status de este schedule
                    required: false // LEFT JOIN para incluir actividades sin status aún
                }],
                transaction // Importante leer dentro de la transacción
            });

            const totalActivities = activitiesWithUpdatedStatus.length;
            let completedCount = 0;
            let newProgress = 0;
            let newScheduleStatus = schedule.status; // Empezar con el estado actual

            if (totalActivities > 0) {
                activitiesWithUpdatedStatus.forEach(activity => {
                    // El 'where' en el include debería filtrar, así que Statuses[0] es el relevante
                    const relevantStatus = activity.Statuses?.[0];
                    if (relevantStatus && relevantStatus.state === 'completed') {
                        completedCount++;
                    }
                });
                newProgress = Math.round((completedCount / totalActivities) * 100);

                // Lógica para determinar el nuevo estado del schedule
                if (newProgress === 100) {
                    newScheduleStatus = 'completed';
                } else if (newProgress > 0 && schedule.status === 'pending') {
                    // Si estaba pendiente y se hizo algo, pasa a en progreso
                    newScheduleStatus = 'in_progress';
                } else if (newProgress > 0) {
                     // Si ya estaba en progreso o completado y baja de 100, se queda en progreso
                     newScheduleStatus = 'in_progress';
                } else { // newProgress === 0
                    // Si el progreso es 0, debería ser 'pending' a menos que ya estuviera 'in_progress'?
                    // Decide la lógica: ¿puede volver a 'pending' desde 'in_progress'?
                    newScheduleStatus = 'pending'; // O mantener 'in_progress' si es preferible
                }

            } else {
                 // Si no hay actividades, ¿el schedule está completo o pendiente?
                 newProgress = 100; // Asumir 100% si no hay tareas?
                 newScheduleStatus = 'completed'; // Asumir completado? O 'pending'?
            }

            // Solo actualizar el schedule si el progreso o el estado han cambiado
            if (schedule.progress !== newProgress || schedule.status !== newScheduleStatus) {
               console.log(`[${new Date().toISOString()}] Updating schedule ${scheduleId} progress from ${schedule.progress}% to ${newProgress}% and status from ${schedule.status} to ${newScheduleStatus}.`);
               await schedule.update({ progress: newProgress, status: newScheduleStatus }, { transaction });
            } else {
               console.log(`[${new Date().toISOString()}] Schedule ${scheduleId} progress (${schedule.progress}%) and status (${schedule.status}) remain unchanged.`);
            }
            // --- Fin Recalcular Progreso ---


            // Si todo fue bien, confirmar la transacción
            await transaction.commit();
            console.log(`[${new Date().toISOString()}] Transaction committed successfully for schedule ${scheduleId}.`);


            // Obtener el schedule final actualizado con todas sus asociaciones para devolverlo
            const finalUpdatedSchedule = await Schedule.findByPk(scheduleId, {
                 include: [
                     {
                         model: Activity,
                         include: [{
                             model: Status,
                             where: { scheduleId: scheduleId },
                             required: false,
                             attributes: ['state', 'completedAt', 'notes'] // Ajusta los atributos según necesites
                         }]
                     },
                     { model: User, attributes: ['id', 'username'] }
                 ]
             });

            console.log(`[${new Date().toISOString()}] Successfully updated statuses for schedule ${scheduleId}. Returning updated schedule.`);
            return res.json({ status: 'success', data: finalUpdatedSchedule }); // Devolver el schedule actualizado

        } catch (error) {
            // Si algo falló, revertir la transacción
            await transaction.rollback();
            console.error(`[${new Date().toISOString()}] Error during status update for schedule ${scheduleId}. Transaction rolled back. Error: ${error.message}`, error.stack);

            // Determinar el código de estado HTTP basado en el tipo de error
            let statusCode = 500; // Error interno del servidor por defecto
            if (error.message.includes("not found") || error.message.includes("not associated") || error.message.includes("Invalid state value")) {
                statusCode = 400; // Bad Request debido a validación fallida
            }
            // Podrías añadir más chequeos para otros tipos de errores (ej. SequelizeValidationError -> 400)

            return res.status(statusCode).json({
                status: 'error',
                message: error.message // Devolver el mensaje de error específico
            });
        }
    }
};

module.exports = scheduleController;