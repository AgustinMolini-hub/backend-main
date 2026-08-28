export const ERROR_DICTIONARY = Object.freeze({
    USER_NOT_FOUND: {
        statusCode: 404,
        message: 'Usuario no encontrado.'
    },

    ORDER_NOT_FOUND: {
        statusCode: 404,
        message: 'Pedido no encontrado.'
    },

        INVALID_ORDER_DATA: {
        statusCode: 400,
        message: 'El usuario y el total son campos obligatorios y deben ser válidos.'
    },

    INVALID_ORDER_STATUS: {
        statusCode: 400,
        message: 'El estado del pedido no es válido.'
    },

    INVALID_PRODUCT_DATA: {
        statusCode: 400,
        message: 'El nombre y el precio son campos obligatorios.'
    },

    INVALID_PRODUCT_PRICE: {
        statusCode: 400,
        message: 'El precio debe ser un número positivo.'
    },

    PRODUCT_NOT_FOUND: {
        statusCode: 404,
        message: 'Producto no encontrado.'
    },

    INVALID_USER_DATA: {
        statusCode: 400,
        message: 'El nombre y el email son campos obligatorios.'
    },

    USER_ALREADY_EXISTS: {
        statusCode: 400,
        message: 'Ya existe un usuario registrado con este email.'
    },

    INVALID_MOCK_QUANTITY: {
        statusCode: 400,
        message: 'La cantidad de mocks debe ser un número entero mayor que cero.'
    },

    NEGATIVE_MOCK_QUANTITY: {
        statusCode: 400,
        message: 'La cantidad de mocks no puede ser negativa.'
    },

    MAX_MOCK_QUANTITY: {
        statusCode: 400,
        message: 'La cantidad máxima de mocks permitida es 100.'
    },

    MOCK_SEED_ERROR: {
        statusCode: 500,
        message: 'No fue posible cargar los datos de prueba.'
    },

    DATABASE_ERROR: {
        statusCode: 500,
        message: 'Ocurrió un error al acceder a la base de datos.'
    }
});
