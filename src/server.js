import app from './app.js';
import { config } from './config/env.config.js';
import { connectDB } from './config/database.js';
import logger from './config/logger.js';

async function startServer() {
    try {
        await connectDB();

        app.listen(config.port, () => {
            logger.info(
                `Servidor ShipNow escuchando en el puerto ${config.port} en modo ${config.nodeEnv}`
            );
        });
    } catch (error) {
        logger.fatal(`Error al iniciar el servidor: ${error.message}`);
        process.exit(1);
    }
}

startServer();
