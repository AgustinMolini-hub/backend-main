import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(
            `Error de configuración: falta la variable de entorno requerida "${envVar}".`
        );
    }
}

const config = Object.freeze({
    port: Number(process.env.PORT),
    mongoUri: process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV
});

export { config };
