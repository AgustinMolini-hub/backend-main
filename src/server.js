import mongoose from 'mongoose';
import app from './app.js';
import { config } from './config/env.config.js';

async function startServer() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Conexión exitosa a MongoDB');

    app.listen(config.port, () => {
      console.log(`Servidor escuchando en el puerto ${config.port} en modo ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    process.exit(1);
  }
}

startServer();