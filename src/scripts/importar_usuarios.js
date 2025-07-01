const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const User = require('../models/user.model');
const { Op } = require('sequelize');

async function importarUsuarios() {
    const usuarios = [];

    // Leer el CSV
    fs.createReadStream('src/scripts/usuarios_2025.csv')
        .pipe(csv())
        .on('data', (row) => {
            // Solo tomamos usuario y password
            usuarios.push({
                username: row.usuario,
                password: row.password
            });
        })
        .on('end', async () => {
            console.log('CSV leído. Procesando usuarios...');
            for (const usuario of usuarios) {
                try {
                    // Validar y asignar email
                    let email;
                    if (usuario.username.includes('@') && usuario.username.includes('.')) {
                        email = usuario.username;
                    } else {
                        // Elimina espacios y caracteres no válidos para email
                        const usernameSanitizado = usuario.username.replace(/[^a-zA-Z0-9]/g, '');
                        email = usernameSanitizado.toLowerCase() + '@ejemplo.com';
                    }

                    // Verificar si ya existe el usuario o el email
                    const existente = await User.findOne({
                        where: {
                            [Op.or]: [
                                { username: usuario.username },
                                { email: email }
                            ]
                        }
                    });

                    if (existente) {
                        console.log(`Usuario ${usuario.username} ya existe. Omitido.`);
                        continue; // Saltar a siguiente usuario
                    }

                    // Hashear la contraseña
                    const hashedPassword = await bcrypt.hash(usuario.password, 8);

                    // Crear usuario
                    await User.create({
                        username: usuario.username,
                        email: email,
                        password: hashedPassword,
                        role: 'user'
                    });
                    console.log(`Usuario ${usuario.username} importado.`);
                } catch (err) {
                    console.error(`Error importando ${usuario.username}:`, err.message);
                }
            }
            console.log('Importación finalizada.');
            process.exit();
        });
}

sequelize.sync().then(importarUsuarios);
