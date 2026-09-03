import dotenv from 'dotenv';


const nodeEnv =
    process.env.NODE_ENV || 'development';


const envFile =
    nodeEnv === 'test'
        ? '.env.test'
        : '.env';


dotenv.config({
    path: envFile
});


// ==========================
// Variables requeridas
// ==========================

const requiredEnv = [
    'PORT',
    'MONGODB_URI',
    'NODE_ENV',
    'LOG_LEVEL'
];


const missingEnv =
    requiredEnv.filter(
        (key) =>
            !process.env[key] ||
            process.env[key].trim() === ''
    );


if (missingEnv.length > 0) {

    throw new Error(
        `Faltan variables de entorno requeridas: ${missingEnv.join(', ')}`
    );

}


// ==========================
// Validación NODE_ENV
// ==========================

const allowedEnvironments = [
    'development',
    'test',
    'production'
];


if (
    !allowedEnvironments.includes(
        process.env.NODE_ENV
    )
) {

    throw new Error(
        `NODE_ENV inválido: ${process.env.NODE_ENV}. Valores permitidos: ${allowedEnvironments.join(', ')}`
    );

}


// ==========================
// Validación PORT
// ==========================

const parsedPort =
    Number(process.env.PORT);


if (
    !Number.isInteger(parsedPort) ||
    parsedPort <= 0 ||
    parsedPort > 65535
) {

    throw new Error(
        `PORT inválido: ${process.env.PORT}. Debe ser un número entero entre 1 y 65535.`
    );

}


// ==========================
// Validación LOG_LEVEL
// ==========================

const allowedLogLevels = [
    'fatal',
    'error',
    'warning',
    'info',
    'http',
    'debug'
];


if (
    !allowedLogLevels.includes(
        process.env.LOG_LEVEL
    )
) {

    throw new Error(
        `LOG_LEVEL inválido: ${process.env.LOG_LEVEL}. Valores permitidos: ${allowedLogLevels.join(', ')}`
    );

}


// ==========================
// Configuración centralizada
// ==========================

export const config = {

    PORT:
        parsedPort,

    port:
        parsedPort,


    MONGODB_URI:
        process.env.MONGODB_URI,

    mongoUri:
        process.env.MONGODB_URI,


    NODE_ENV:
        process.env.NODE_ENV,

    nodeEnv:
        process.env.NODE_ENV,


    LOG_LEVEL:
        process.env.LOG_LEVEL,

    logLevel:
        process.env.LOG_LEVEL

};


export default config;