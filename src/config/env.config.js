import dotenv from 'dotenv';

const envFile =
    process.env.NODE_ENV === 'test'
        ? '.env.test'
        : '.env';

dotenv.config({
    path: envFile
});


const requiredEnv = [
    'PORT',
    'MONGODB_URI',
    'NODE_ENV'
];


const missingEnv = requiredEnv.filter(
    (key) => !process.env[key]
);


if (missingEnv.length > 0) {

    throw new Error(
        `Faltan variables de entorno requeridas: ${missingEnv.join(', ')}`
    );

}


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