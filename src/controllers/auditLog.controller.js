const { AuditLog } = require('../models');
const { Op } = require('sequelize');

// Crear un registro de auditoría
exports.createAuditLog = async (req, res) => {
  try {
    const { userId, userName, userRole, action, scheduleId, activities, timestamp } = req.body;
    if (!userId || !userName || !userRole || !action || !scheduleId || !activities || !timestamp) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
    const log = await AuditLog.create({
      userId,
      userName,
      userRole,
      action,
      scheduleId,
      activities,
      timestamp
    });
    res.status(201).json(log);
  } catch (error) {
    console.error('Error al crear log de auditoría:', error);
    res.status(500).json({ message: 'Error interno al registrar auditoría.' });
  }
};

// Obtener todos los registros de auditoría
exports.getAuditLogs = async (req, res) => {
  try {
    const { userId, action, scheduleId, from, to } = req.query;
    const where = {};
    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (scheduleId) where.scheduleId = scheduleId;
    if (from || to) {
      where.timestamp = {};
      if (from) where.timestamp[Op.gte] = new Date(from);
      if (to) where.timestamp[Op.lte] = new Date(to);
    }
    const logs = await AuditLog.findAll({
      where,
      order: [['timestamp', 'DESC']]
    });
    res.json(logs);
  } catch (error) {
    console.error('Error al obtener logs de auditoría:', error);
    res.status(500).json({ message: 'Error interno al consultar auditoría.' });
  }
}; 