import mongoose from 'mongoose';
import { config } from './env.config.js';
import logger from './logger.js';

export async function connectDB() {
    try {
        await mongoose.connect(config.mongoUri);

        logger.info('Conexión a MongoDB establecida');
    } catch (error) {
        logger.fatal(
            `Error al conectar con MongoDB: ${error.message}`
        );

        throw error;
    }
}
