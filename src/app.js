import express from 'express';
import swaggerUi from 'swagger-ui-express';

import productRouter from './routes/product.routes.js';
import userRouter from './routes/user.routes.js';
import mockRouter from './routes/mock.routes.js';
import orderRouter from './routes/order.routes.js';
import loggerRouter from './routes/logger.routes.js';

import { swaggerSpec } from './docs/swagger.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { config } from './config/env.config.js';


const app = express();


// ==========================
// Middlewares globales
// ==========================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================
// Archivos públicos
// ==========================

app.use(
    '/uploads',
    express.static('uploads')
);


// ==========================
// Swagger
// ==========================

app.get(
    '/api/docs',
    (req, res) => {

        res.status(200).json({

            status: 'success',

            message: 'Swagger UI disponible',

            docs: '/api/docs/'

        });

    }
);


app.use(
    '/api/docs/',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);


// ==========================
// Rutas API principales
// ==========================

app.use(
    '/api/products',
    productRouter
);


app.use(
    '/api/users',
    userRouter
);


app.use(
    '/api/orders',
    orderRouter
);


// ==========================
// Rutas internas
// Solo development y test
// ==========================

if (config.nodeEnv !== 'production') {

    app.use(
        '/api/mocks',
        mockRouter
    );


    app.use(
        '/api',
        loggerRouter
    );

}


// ==========================
// Health check
// ==========================

app.get(
    '/health',
    (req, res) => {

        res.status(200).json({

            status: 'ok',

            environment:
                config.nodeEnv,

            uptime:
                process.uptime(),

            timestamp:
                new Date().toISOString()

        });

    }
);


// ==========================
// Middleware global errores
// SIEMPRE AL FINAL
// ==========================

app.use(
    errorMiddleware
);


export default app;