export const ERROR_DICTIONARY = Object.freeze({

    // ==========================
    // USERS
    // ==========================

    USER_NOT_FOUND: {
        statusCode: 404,
        message: 'Usuario no encontrado.'
    },


    INVALID_USER_ID: {
        statusCode: 400,
        message: 'El ID del usuario no tiene un formato válido.'
    },


    INVALID_USER_DATA: {
        statusCode: 400,
        message: 'El nombre y el email son campos obligatorios.'
    },


    USER_ALREADY_EXISTS: {
        statusCode: 400,
        message: 'Ya existe un usuario registrado con este email.'
    },



    // ==========================
    // ORDERS
    // ==========================

    ORDER_NOT_FOUND: {
        statusCode: 404,
        message: 'Pedido no encontrado.'
    },


    INVALID_ORDER_ID: {
        statusCode: 400,
        message: 'El ID del pedido no tiene un formato válido.'
    },


    INVALID_ORDER_DATA: {
        statusCode: 400,
        message: 'El usuario y el total son campos obligatorios y deben ser válidos.'
    },


    INVALID_ORDER_STATUS: {
        statusCode: 400,
        message: 'El estado del pedido no es válido.'
    },



    // ==========================
    // PRODUCTS
    // ==========================

    PRODUCT_NOT_FOUND: {
        statusCode: 404,
        message: 'Producto no encontrado.'
    },


    INVALID_PRODUCT_ID: {
        statusCode: 400,
        message: 'El ID del producto no tiene un formato válido.'
    },


    INVALID_PRODUCT_DATA: {
        statusCode: 400,
        message: 'El nombre y el precio son campos obligatorios.'
    },


    INVALID_PRODUCT_PRICE: {
        statusCode: 400,
        message: 'El precio debe ser un número positivo.'
    },


    INVALID_PRODUCT_STOCK: {
        statusCode: 400,
        message: 'El stock debe ser un número mayor o igual a cero.'
    },



    // ==========================
    // MOCKS
    // ==========================

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



    // ==========================
    // DATABASE
    // ==========================

    DATABASE_ERROR: {
        statusCode: 500,
        message: 'Ocurrió un error al acceder a la base de datos.'
    },



    // ==========================
    // FILE UPLOADS
    // ==========================

    FILE_REQUIRED: {
        statusCode: 400,
        message: 'El archivo es obligatorio.'
    },


    INVALID_FILE_TYPE: {
        statusCode: 400,
        message: 'El tipo de archivo no está permitido. Solo se aceptan archivos PDF, JPG, JPEG y PNG.'
    },


    INVALID_FILE_FIELD: {
        statusCode: 400,
        message: 'El campo del archivo no es válido.'
    },


    FILE_TOO_LARGE: {
        statusCode: 400,
        message: 'El archivo supera el tamaño máximo permitido de 5 MB.'
    },


    INVALID_DOCUMENT_TYPE: {
        statusCode: 400,
        message: 'El tipo de documento no es válido.'
    },


    INVALID_UPLOAD_TYPE: {
        statusCode: 400,
        message: 'El tipo de carga de archivo no es válido.'
    },


    FILE_SAVE_ERROR: {
        statusCode: 500,
        message: 'No fue posible guardar el archivo.'
    },



    // ==========================
    // GENERAL
    // ==========================

    INTERNAL_SERVER_ERROR: {
        statusCode: 500,
        message: 'Ocurrió un error interno del servidor.'
    }

});