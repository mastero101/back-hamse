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
                console.log('Attempting to set activities:', req.body.activities); // Log para ver los IDs
                try {
                    await schedule.setActivities(req.body.activities);
                    console.log('Successfully set activities for schedule:', schedule.id); // Log de éxito
                } catch (assocError) {
                    console.error('Error setting activities:', assocError); // Log si setActivities falla
                }
            } else {
                console.log('No valid activities array found in request body.'); // Log si no hay activities
            }

            return res.status(201).json({
                status: 'success',
                data: schedule
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
                            attributes: ['state', 'completedAt', 'notes'] // Especifica los atributos que necesitas
                        }]
                    },
                    {
                        model: User,
                        attributes: ['id', 'username']
                    }
                ]
            });

            return res.json({
                status: 'success',
                data: schedules
            });
        } catch (error) {
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
                        include: [{ // <-- Asegurarse que Status está incluido (ya estaba)
                            model: Status,
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
            await schedule.update(req.body);

            if (req.body.activities && Array.isArray(req.body.activities)) {
                console.log('Attempting to set activities:', req.body.activities); // Log para ver los IDs
                try {
                    await schedule.setActivities(req.body.activities);
                    console.log('Successfully set activities for schedule:', schedule.id); // Log de éxito
                } catch (assocError) {
                    console.error('Error setting activities:', assocError); // Log si setActivities falla
                }
            } else {
                console.log('No valid activities array found in request body for update.'); // Log si no hay activities
            }

            // Devolver el schedule actualizado con sus asociaciones (si las tiene)
            const updatedSchedule = await Schedule.findByPk(req.params.id, { include: [Activity] });
            return res.json({
                status: 'success',
                data: updatedSchedule // Devolver el schedule con las actividades
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
            const schedule = await Schedule.findByPk(req.params.id);
            if (!schedule) {
                return res.status(404).json({ status: 'error', message: 'Schedule not found' });
            }

            // Recalcular progreso basado en los Status asociados a las Activities del Schedule
            const activities = await schedule.getActivities({ include: [Status] });
            const totalActivities = activities.length;
            if (totalActivities === 0) {
                await schedule.update({ progress: 100, status: 'completed' }); // O 0 y 'pending' si no hay actividades
                return res.json({ status: 'success', data: { progress: schedule.progress } });
            }

            let completedCount = 0;
            activities.forEach(activity => {
                // Asumiendo que Status está directamente en Activity o a través de una relación
                // y que 'completed' es el estado final. Ajusta la lógica si es necesario.
                if (activity.Status && activity.Status.state === 'completed') {
                    completedCount++;
                }
            });

            const progress = Math.round((completedCount / totalActivities) * 100);
            let scheduleStatus = 'in_progress';
            if (progress === 100) {
                scheduleStatus = 'completed';
            } else if (progress === 0) {
                // Podrías querer mantener 'pending' o 'in_progress' si ya se empezó
                 scheduleStatus = schedule.status === 'pending' ? 'pending' : 'in_progress';
            }

            await schedule.update({ progress, status: scheduleStatus });

            return res.json({ status: 'success', data: { progress: schedule.progress } });
        } catch (error) {
             console.error(`Error updating progress for schedule ${req.params.id}:`, error);
             return res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // --- Nueva función ---
    updateActivityStatuses: async (req, res) => {
        const scheduleId = req.params.id;
        const statusUpdates = req.body.statuses; // Espera { statuses: [ { activityId, state, notes? }, ... ] }

        if (!Array.isArray(statusUpdates)) {
            return res.status(400).json({ status: 'error', message: 'Invalid input: statuses must be an array.' });
        }

        const transaction = await sequelize.transaction();

        try {
            const schedule = await Schedule.findByPk(scheduleId, { transaction });
            if (!schedule) {
                await transaction.rollback();
                return res.status(404).json({ status: 'error', message: 'Schedule not found' });
            }

            // Validar que todas las actividades pertenezcan al schedule (opcional pero recomendado)
            const scheduleActivities = await schedule.getActivities({ attributes: ['id'], transaction });
            const scheduleActivityIds = new Set(scheduleActivities.map(a => a.id));

            for (const update of statusUpdates) {
                if (!update.activityId || !update.state) {
                    throw new Error(`Invalid status update object: ${JSON.stringify(update)}. Missing activityId or state.`);
                }
                if (!scheduleActivityIds.has(update.activityId)) {
                     throw new Error(`Activity ${update.activityId} does not belong to schedule ${scheduleId}.`);
                }

                // Encuentra la actividad para asegurar que existe (aunque ya validamos pertenencia)
                const activity = await Activity.findByPk(update.activityId, { transaction });
                if (!activity) {
                     // Esto no debería pasar si la validación anterior funcionó, pero por si acaso
                     throw new Error(`Activity ${update.activityId} not found.`);
                }

                // Encuentra o crea el registro de Status para esta Actividad
                // NOTA: Esto asume un Status por Actividad. Si necesitas Status por Actividad POR Schedule,
                // la lógica y/o el modelo necesitarían cambiar (ej. Status asociado a ActivitySchedule).
                let statusRecord = await Status.findOne({ where: { ActivityId: activity.id }, transaction });

                const statusData = {
                    state: update.state,
                    notes: update.notes || null, // Asignar notas si existen, sino null
                    completedAt: update.state === 'completed' ? new Date() : null, // Marcar completado si aplica
                    ActivityId: activity.id // Asegurar la asociación
                };

                if (statusRecord) {
                    // Actualizar estado existente
                    await statusRecord.update(statusData, { transaction });
                    console.log(`Updated status for activity ${activity.id} to ${update.state}`);
                } else {
                    // Crear nuevo estado si no existe
                    statusRecord = await Status.create(statusData, { transaction });
                    console.log(`Created status for activity ${activity.id} with state ${update.state}`);
                    // Si Status no estaba asociado automáticamente a Activity (depende de tus modelos),
                    // podrías necesitar asociarlo explícitamente aquí.
                    // await activity.setStatus(statusRecord, { transaction }); // Descomentar si es necesario
                }
            }

            // Recalcular el progreso del Schedule después de actualizar los estados
            const activities = await schedule.getActivities({ include: [Status], transaction });
            const totalActivities = activities.length;
            let completedCount = 0;
            if (totalActivities > 0) {
                activities.forEach(act => {
                    // Asegúrate que act.Status existe y tiene la propiedad 'state'
                    if (act.Status && act.Status.state === 'completed') {
                        completedCount++;
                    }
                });
                const progress = Math.round((completedCount / totalActivities) * 100);
                let scheduleStatus = 'in_progress';
                 if (progress === 100) scheduleStatus = 'completed';
                 else if (completedCount === 0 && schedule.status === 'pending') scheduleStatus = 'pending'; // Mantener pending si no se ha iniciado nada

                await schedule.update({ progress, status: scheduleStatus }, { transaction });
                console.log(`Updated schedule ${scheduleId} progress to ${progress}% and status to ${scheduleStatus}`);
            } else {
                 await schedule.update({ progress: 100, status: 'completed' }, { transaction }); // O 0 y pending
                 console.log(`Updated schedule ${scheduleId} (no activities) progress to 100% and status to completed`);
            }


            await transaction.commit(); // Confirmar todos los cambios

            // Devolver el schedule actualizado con sus actividades y estados
             const updatedSchedule = await Schedule.findByPk(scheduleId, {
                 include: [
                     {
                         model: Activity,
                         include: [{ model: Status, attributes: ['state', 'completedAt', 'notes'] }]
                     },
                     { model: User, attributes: ['id', 'username'] }
                 ]
             });


            return res.json({
                status: 'success',
                message: 'Activity statuses updated successfully.',
                data: updatedSchedule // Devolver el schedule actualizado
            });

        } catch (error) {
            await transaction.rollback(); // Revertir en caso de error
            console.error(`Error updating activity statuses for schedule ${scheduleId}:`, error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Failed to update activity statuses.'
            });
        }
    }
    // --- Fin Nueva función ---
};

module.exports = scheduleController;