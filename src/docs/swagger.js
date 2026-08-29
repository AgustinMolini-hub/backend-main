import swaggerJsdoc from 'swagger-jsdoc';


const swaggerDefinition = {

    openapi: '3.0.3',

    info: {

        title: 'ShipNow API',

        version: '1.0.0',

        description:
            `
            API REST ShipNow.

            Sistema de gestión de usuarios, productos,
            pedidos, entregas, datos mock,
            carga de documentos y logging profesional.

            Arquitectura:
            Controller → Service → Repository
            `

    },


    servers: [

        {
            url: 'http://localhost:8080',
            description: 'Servidor local'
        }

    ],



    tags: [

        {
            name: 'Users',
            description: 'Gestión de usuarios'
        },

        {
            name: 'Products',
            description: 'Gestión de productos'
        },

        {
            name: 'Orders',
            description: 'Gestión de pedidos y comprobantes'
        },

        {
            name: 'Deliveries',
            description: 'Gestión de entregas'
        },

        {
            name: 'Mocks',
            description: 'Generación e inserción de datos de prueba'
        },

        {
            name: 'Logger',
            description: 'Pruebas del sistema Winston Logger'
        }

    ],



    components: {


        schemas: {


            User: {

                type: 'object',

                properties: {

                    _id: {

                        type: 'string',

                        example:
                            '66b7c2f9a123456789abcdef'

                    },


                    name: {

                        type: 'string',

                        example:
                            'Agustin Molini'

                    },


                    email: {

                        type: 'string',

                        example:
                            'usuario@test.com'

                    },


                    role: {

                        type: 'string',

                        enum: [

                            'ADMIN',
                            'USER',
                            'DRIVER'

                        ],

                        example:
                            'USER'

                    },


                    documents: {

                        type:'array',

                        items: {

                            $ref:
                            '#/components/schemas/Receipt'

                        }

                    }

                }

            },





            Product: {

                type:'object',

                properties:{


                    _id: {

                        type:'string'

                    },


                    name: {

                        type:'string',

                        example:
                        'Mouse gamer'

                    },


                    price: {

                        type:'number',

                        example:
                        25000

                    },


                    stock: {

                        type:'number',

                        example:
                        15

                    },


                    status: {

                        type:'string',

                        enum:[

                            'AVAILABLE',
                            'OUT_OF_STOCK'

                        ]

                    }

                }

            },







            Order: {

                type:'object',

                properties:{


                    _id: {

                        type:'string'

                    },


                    user: {

                        type:'string',

                        description:
                        'Usuario dueño del pedido'

                    },


                    status: {

                        type:'string',

                        enum:[

                            'PENDING',
                            'CONFIRMED',
                            'IN_TRANSIT',
                            'DELIVERED',
                            'CANCELLED'

                        ]

                    },


                    priority: {

                        type:'string',

                        enum:[

                            'LOW',
                            'MEDIUM',
                            'HIGH'

                        ]

                    },


                    total: {

                        type:'number',

                        example:
                        15000

                    },


                    receipt: {

                        $ref:
                        '#/components/schemas/Receipt'

                    }


                }

            },







            Delivery: {


                type:'object',


                properties:{


                    _id:{

                        type:'string'

                    },


                    order:{

                        type:'string'

                    },


                    driver:{

                        type:'string'

                    },


                    status:{

                        type:'string',

                        enum:[

                            'PENDING',
                            'ASSIGNED',
                            'IN_TRANSIT',
                            'DELIVERED',
                            'FAILED'

                        ]

                    }


                }


            },









            Receipt:{


                type:'object',


                properties:{


                    originalName:{

                        type:'string',

                        example:
                        'comprobante.jpg'

                    },


                    filename:{

                        type:'string',

                        example:
                        '173821882-comprobante.jpg'

                    },


                    path:{

                        type:'string',

                        example:
                        'uploads/receipts/file.jpg'

                    },


                    mimetype:{

                        type:'string',

                        example:
                        'image/jpeg'

                    },


                    size:{

                        type:'number',

                        example:
                        25000

                    },


                    documentType:{

                        type:'string',

                        example:
                        'LICENSE'

                    },


                    uploadedAt:{

                        type:'string',

                        format:
                        'date-time'

                    }

                }


            },











            ErrorResponse:{


                type:'object',


                properties:{


                    status:{

                        type:'string',

                        example:
                        'error'

                    },


                    error:{


                        type:'object',


                        properties:{


                            code:{

                                type:'string',

                                example:
                                'USER_NOT_FOUND'

                            },


                            message:{

                                type:'string',

                                example:
                                'Usuario inexistente'

                            },


                            details:{

                                nullable:true

                            }


                        }

                    }


                }


            },









            SuccessResponse:{


                type:'object',


                properties:{


                    status:{

                        type:'string',

                        example:
                        'success'

                    },


                    payload:{

                        type:'object'

                    }


                }


            },









            MockSeedResponse:{


                type:'object',


                properties:{


                    status:{

                        type:'string',

                        example:
                        'success'

                    },


                    message:{

                        type:'string',

                        example:
                        'Datos insertados correctamente'

                    },


                    inserted:{

                        type:'number',

                        example:
                        10

                    }


                }


            }


        }

    }


};







const swaggerOptions = {


    definition: swaggerDefinition,


    apis:[

        './src/routes/*.js'

    ]


};







export const swaggerSpec =
    swaggerJsdoc(swaggerOptions);