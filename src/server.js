import app from './app.js';
import { config } from './config/env.config.js';
import { connectDB } from './config/database.js';

async function startServer() {
    try {
        await connectDB();

        app.listen(config.port, () => {
            console.log(
                `Servidor escuchando en el puerto ${config.port} en modo ${config.nodeEnv}`
            );
        });
    } catch (error) {
        console.error(
            'Error al iniciar el servidor:',
            error.message
        );

        process.exit(1);
    }
}

startServer();
