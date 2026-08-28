import express from 'express';
import productRouter from './routes/product.routes.js';
import userRouter from './routes/user.routes.js';
import mockRouter from './routes/mock.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/mocks', mockRouter);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

app.use(errorMiddleware);

export default app;
