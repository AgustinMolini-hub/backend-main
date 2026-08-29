import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.3',

    info: {
        title: 'ShipNow API',
        version: '1.0.0',
        description:
            'API REST de ShipNow desarrollada con Node.js, Express y MongoDB. ' +
            'Permite gestionar usuarios, productos, pedidos, comprobantes, ' +
            'generar datos mock para pruebas y validar el sistema de logging.'
    },

    servers: [
        {
            url: 'http://localhost:8080',
            description: 'Servidor local de desarrollo'
        }
    ],

    tags: [
        {
            name: 'Users',
            description: 'Operaciones relacionadas con usuarios.'
        },
        {
            name: 'Products',
            description: 'Operaciones relacionadas con productos.'
        },
        {
            name: 'Orders',
            description: 'Gestión de pedidos y comprobantes.'
        },
        {
            name: 'Deliveries',
            description:
                'Modelo de entregas utilizado por el sistema de mocks.'
        },
        {
            name: 'Mocks',
            description: 'Generación e inserción de datos de prueba.'
        },
        {
            name: 'Logger',
            description:
                'Herramientas de validación del sistema de logging.'
        }
    ],

    components: {
        schemas: {

            User: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                    _id: {
                        type: 'string',
                        example: '66b7c2f9a123456789abcdef'
                    },
                    name: {
                        type: 'string',
                        example: 'Usuario Prueba'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'usuario.prueba@test.com'
                    },
                    role: {
                        type: 'string',
                        enum: [
                            'ADMIN',
                            'USER',
                            'DRIVER'
                        ],
                        example: 'USER'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time'
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time'
                    }
                }
            },


            Product: {
                type: 'object',
                required: [
                    'name',
                    'price'
                ],
                properties: {
                    _id: {
                        type: 'string',
                        example: '66b7c2f9a123456789abcdef'
                    },
                    name: {
                        type: 'string',
                        example: 'Producto de prueba'
                    },
                    price: {
                        type: 'number',
                        example: 1500.50
                    },
                    stock: {
                        type: 'integer',
                        example: 20
                    },
                    status: {
                        type: 'string',
                        enum: [
                            'AVAILABLE',
                            'OUT_OF_STOCK',
                            'DISCONTINUED'
                        ],
                        example: 'AVAILABLE'
                    }
                }
            },


            Receipt: {
                type: 'object',
                properties: {
                    originalName: {
                        type: 'string',
                        example: 'comprobante.png'
                    },
                    filename: {
                        type: 'string',
                        example: '1788003224670-488593803.png'
                    },
                    path: {
                        type: 'string',
                        example:
                            'uploads/receipts/1788003224670-488593803.png'
                    },
                    mimetype: {
                        type: 'string',
                        example: 'image/png'
                    },
                    size: {
                        type: 'number',
                        example: 13728
                    },
                    uploadedAt: {
                        type: 'string',
                        format: 'date-time'
                    }
                }
            },


            Order: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        example: '66b7c2f9a123456789abcdef'
                    },
                    user: {
                        type: 'string',
                        description:
                            'ID del usuario propietario del pedido.',
                        example:
                            '66b7c2f9a123456789abcde1'
                    },
                    status: {
                        type: 'string',
                        enum: [
                            'PENDING',
                            'CONFIRMED',
                            'IN_TRANSIT',
                            'DELIVERED',
                            'CANCELLED'
                        ],
                        example: 'PENDING'
                    },
                    priority: {
                        type: 'string',
                        enum: [
                            'LOW',
                            'MEDIUM',
                            'HIGH'
                        ],
                        example: 'MEDIUM'
                    },
                    total: {
                        type: 'number',
                        minimum: 0,
                        example: 12500.75
                    },
                    receipt: {
                        $ref:
                            '#/components/schemas/Receipt'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time'
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time'
                    }
                }
            },


            Delivery: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        example: '66b7c2f9a123456789abcdef'
                    },
                    order: {
                        type: 'string',
                        example:
                            '66b7c2f9a123456789abcde1'
                    },
                    driver: {
                        type: 'string',
                        example:
                            '66b7c2f9a123456789abcde2'
                    },
                    status: {
                        type: 'string',
                        enum: [
                            'PENDING',
                            'ASSIGNED',
                            'IN_TRANSIT',
                            'DELIVERED',
                            'FAILED'
                        ],
                        example: 'ASSIGNED'
                    }
                }
            },


            ErrorResponse: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        example: 'error'
                    },
                    error: {
                        type: 'object',
                        properties: {
                            code: {
                                type: 'string',
                                example:
                                    'INVALID_USER_DATA'
                            },
                            message: {
                                type: 'string',
                                example:
                                    'El nombre y el email son campos obligatorios.'
                            },
                            details: {
                                nullable: true,
                                example: null
                            }
                        }
                    }
                }
            },


            SuccessResponse: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        example: 'success'
                    },
                    payload: {
                        type: 'object',
                        additionalProperties: true
                    }
                }
            },


            MockSeedResponse: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        example: 'success'
                    },
                    message: {
                        type: 'string',
                        example:
                            'Datos de prueba insertados correctamente.'
                    },
                    users: {
                        type: 'integer',
                        example: 5
                    },
                    drivers: {
                        type: 'integer',
                        example: 3
                    },
                    orders: {
                        type: 'integer',
                        example: 5
                    },
                    deliveries: {
                        type: 'integer',
                        example: 5
                    }
                }
            }
        }
    }
};


const swaggerOptions = {
    definition: swaggerDefinition,
    apis: [
        './src/routes/*.js',
        './src/app.js'
    ]
};


export const swaggerSpec = swaggerJsdoc(swaggerOptions);