import mongoose from 'mongoose';
import { config } from './env.config.js';

export async function connectDB() {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('Conexión exitosa a MongoDB');
    } catch (error) {
        throw new Error(
            `Error al conectar con MongoDB: ${error.message}`
        );
    }
}
