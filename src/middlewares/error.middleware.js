import { AppError } from '../errors/app.error.js';
import { ERROR_DICTIONARY } from '../errors/error.dictionary.js';
import logger from '../config/logger.js';

export const errorMiddleware = (err, req, res, next) => {
    const errorCode = err instanceof AppError
        ? err.errorCode
        : 'INTERNAL_SERVER_ERROR';

    const errorDefinition = ERROR_DICTIONARY[errorCode];

    if (err instanceof AppError && errorDefinition) {
        logger.warning(
            `${req.method} ${req.originalUrl} - ${errorCode}: ${errorDefinition.message}`
        );

        return res.status(errorDefinition.statusCode).json({
            status: 'error',
            error: {
                code: errorCode,
                message: errorDefinition.message,
                details: err.details
            }
        });
    }

    logger.error(
        `${req.method} ${req.originalUrl} - Error inesperado: ${err.message}`,
        {
            stack: err.stack
        }
    );

    return res.status(500).json({
        status: 'error',
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Ocurrió un error interno del servidor.'
        }
    });
};
