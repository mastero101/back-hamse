const { Sequelize, sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    stock: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

module.exports = Product; 