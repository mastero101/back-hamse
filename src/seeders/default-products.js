'use strict';

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Lee el archivo JSON generado
    const productsPath = path.join(__dirname, 'productos.json');
    const rawProducts = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

    const now = new Date();
    // Mapea los campos del JSON a los del modelo Product
    const products = rawProducts.map((p, i) => ({
      id: i + 1, // id numérico incremental empezando en 1
      name: p.name,
      description: (p.descripcion && p.descripcion !== 'NULL') ? p.descripcion : '',
      price: Number(p.price) || 0,
      stock: 0, // Puedes poner un valor por defecto o agregarlo si tienes ese dato
      createdAt: now,
      updatedAt: now
    }));

    await queryInterface.bulkInsert('Products', products, {});
    console.log('Default products seeded successfully');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
    console.log('Default products removed');
  }
}; 