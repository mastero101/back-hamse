const { Setting } = require('../models');

const settingsController = {
    // Obtener el número de WhatsApp
    getWhatsappNumber: async (req, res) => {
        try {
            const setting = await Setting.findByPk('whatsappNumber');
            if (!setting) {
                // Esto no debería ocurrir si la inicialización funciona, pero es bueno manejarlo
                console.error('Setting whatsappNumber not found in database.');
                return res.status(500).json({ message: 'Configuración de WhatsApp no encontrada.' });
            }
            res.json({ whatsappNumber: setting.value });
        } catch (error) {
            console.error('Error fetching WhatsApp number:', error);
            res.status(500).json({ message: 'Error al obtener el número de WhatsApp.' });
        }
    },

    // Actualizar el número de WhatsApp
    updateWhatsappNumber: async (req, res) => {
        const { whatsappNumber } = req.body;
        if (!whatsappNumber) {
            return res.status(400).send({ message: 'El número de WhatsApp es requerido.' });
        }

        try {
            const setting = await Setting.findByPk('whatsappNumber');
            if (!setting) {
                 // Si por alguna razón no existe, créalo
                 await Setting.create({ key: 'whatsappNumber', value: whatsappNumber });
                 console.log(`WhatsApp number created and set to: ${whatsappNumber}`);
                 return res.send({ message: 'Número de WhatsApp configurado correctamente.' });
            }

            // Si existe, actualízalo
            setting.value = whatsappNumber;
            await setting.save();
            console.log(`WhatsApp number updated to: ${whatsappNumber}`);
            res.send({ message: 'Número de WhatsApp actualizado correctamente.' });

        } catch (error) {
            console.error('Error updating WhatsApp number:', error);
            res.status(500).json({ message: 'Error al actualizar el número de WhatsApp.' });
        }
    },

    // Obtener cualquier setting por key
    getSettingByKey: async (req, res) => {
        const { key } = req.params;
        if (!key) {
            return res.status(400).json({ message: 'Key requerida.' });
        }
        try {
            const setting = await Setting.findByPk(key);
            if (!setting) {
                return res.status(404).json({ message: 'Setting no encontrada.' });
            }
            res.json({ key: setting.key, value: setting.value });
        } catch (error) {
            console.error('Error al obtener setting:', error);
            res.status(500).json({ message: 'Error al obtener setting.' });
        }
    },

    // Actualizar cualquier setting por key (solo admin)
    updateSettingByKey: async (req, res) => {
        const { key } = req.params;
        const { value } = req.body;
        if (!key) {
            return res.status(400).json({ message: 'Key requerida.' });
        }
        if (typeof value === 'undefined') {
            return res.status(400).json({ message: 'Value requerido.' });
        }
        try {
            let setting = await Setting.findByPk(key);
            if (!setting) {
                setting = await Setting.create({ key, value });
            } else {
                setting.value = value;
                await setting.save();
            }
            res.json({ message: 'Setting actualizada correctamente.', key, value });
        } catch (error) {
            console.error('Error al actualizar setting:', error);
            res.status(500).json({ message: 'Error al actualizar setting.' });
        }
    }
};

module.exports = settingsController;