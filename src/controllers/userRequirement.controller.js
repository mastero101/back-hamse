const { UserRequirement, Requirement } = require('../models');
const { Op } = require('sequelize');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const S3_BUCKET = process.env.AWS_S3_BUCKET;
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const userRequirementController = {
  // Obtener todos los estados de requerimientos para el usuario autenticado
  getAll: async (req, res) => {
    try {
      const userId = req.userId;
      // Traer todos los requerimientos globales
      const requirements = await Requirement.findAll({
        where: { userId: null },
        order: [['dependency', 'ASC'], ['title', 'ASC']]
      });
      // Traer todos los estados de requerimientos de este usuario
      const userStates = await UserRequirement.findAll({
        where: { userId },
      });
      // Mapear los estados por requirementId para acceso rápido
      const stateMap = {};
      userStates.forEach(state => {
        stateMap[state.requirementId] = state;
      });
      // Unir catálogo global con estado individual
      const result = requirements.map(req => {
        const data = req.toJSON();
        const userState = stateMap[req.id];
        return {
          ...data,
          userRequirement: userState ? userState.toJSON() : null
        };
      });
      return res.json({ status: 'success', data: result });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Obtener el estado de un requerimiento específico para el usuario autenticado
  getOne: async (req, res) => {
    try {
      const userId = req.userId;
      const { requirementId } = req.params;
      const userReq = await UserRequirement.findOne({
        where: { userId, requirementId }
      });
      if (!userReq) {
        return res.status(404).json({ status: 'error', message: 'No existe estado para este requerimiento y usuario' });
      }
      return res.json({ status: 'success', data: userReq });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Crear o actualizar el estado de un requerimiento para el usuario autenticado
  upsert: async (req, res) => {
    try {
      const userId = req.userId;
      const { requirementId } = req.body;
      if (!requirementId) {
        return res.status(400).json({ status: 'error', message: 'Falta requirementId' });
      }
      const [userReq, created] = await UserRequirement.findOrCreate({
        where: { userId, requirementId },
        defaults: {
          completed: req.body.completed || false,
          reminderDates: req.body.reminderDates || [],
          respaldo: req.body.respaldo || {}
        }
      });
      if (!created) {
        // Actualizar si ya existe
        await userReq.update({
          completed: req.body.completed ?? userReq.completed,
          reminderDates: req.body.reminderDates ?? userReq.reminderDates,
          respaldo: req.body.respaldo ?? userReq.respaldo
        });
      }
      return res.json({ status: 'success', data: userReq });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  },

  uploadRespaldoS3: async (req, res) => {
    try {
      const userId = req.userId;
      const { requirementId } = req.params;
      const nota = req.body.nota || '';
      const file = req.file;
      let fileUrl = '';
      if (file) {
        const key = `user-respaldos/${userId}/${Date.now()}_${file.originalname}`;
        const command = new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype
        });
        await s3Client.send(command);
        fileUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      }
      // Buscar o crear el UserRequirement
      let userReq = await UserRequirement.findOne({ where: { userId, requirementId } });
      if (!userReq) {
        userReq = await UserRequirement.create({
          userId,
          requirementId,
          completed: false,
          reminderDates: [],
          respaldo: { url: fileUrl, nota }
        });
      } else {
        userReq.respaldo = { url: fileUrl, nota };
        await userReq.save();
      }
      return res.json({ status: 'success', respaldo: userReq.respaldo });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = userRequirementController; 