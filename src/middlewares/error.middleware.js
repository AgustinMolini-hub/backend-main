import { AppError } from '../errors/app.error.js';
import { ERROR_DICTIONARY } from '../errors/error.dictionary.js';

export const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    if (err instanceof AppError) {
        const error = ERROR_DICTIONARY[err.errorCode];

        if (error) {
            return res.status(error.statusCode).json({
                status: 'error',
                error: {
                    code: err.errorCode,
                    message: error.message,
                    details: err.details
                }
            });
        }
    }

    return res.status(500).json({
        status: 'error',
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Ocurrió un error interno del servidor.'
        }
    });
};
