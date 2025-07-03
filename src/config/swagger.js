const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HAMSE API',
            version: '1.0.0',
            description: 'API documentation for HAMSE maintenance management system',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 1072}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            },
            schemas: {
                Product: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Aceite 10W40' },
                        description: { type: 'string', example: 'Aceite sintético para motor' },
                        price: { type: 'number', example: 199.99 },
                        stock: { type: 'integer', example: 50 },
                        url: { type: 'string', example: 'https://ejemplo.com/producto.jpg' },
                        supplier: { type: 'string', example: 'Quaker' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                ProductInput: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', example: 'Aceite 10W40' },
                        description: { type: 'string', example: 'Aceite sintético para motor' },
                        price: { type: 'number', example: 199.99 },
                        stock: { type: 'integer', example: 50 },
                        url: { type: 'string', example: 'https://ejemplo.com/producto.jpg' },
                        supplier: { type: 'string', example: 'Quaker' }
                    },
                    required: ['name', 'price', 'stock']
                }
            }
        }
    },
    apis: ['./src/routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;