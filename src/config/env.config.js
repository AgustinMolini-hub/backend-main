import dotenv from 'dotenv';

dotenv.config();


const requiredEnv = [
    'PORT',
    'MONGODB_URI',
    'NODE_ENV'
];


requiredEnv.forEach((key) => {

    if (!process.env[key]) {

        throw new Error(
            `Falta variable de entorno requerida: ${key}`
        );

    }

});


export const config = {

    // formatos posibles usados en el proyecto

    PORT:
        process.env.PORT,

    port:
        process.env.PORT,


    MONGODB_URI:
        process.env.MONGODB_URI,

    mongoUri:
        process.env.MONGODB_URI,


    NODE_ENV:
        process.env.NODE_ENV,

    nodeEnv:
        process.env.NODE_ENV

};


export default config;