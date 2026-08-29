import logger from '../config/logger.js';

export const testLogger = (req, res) => {

    logger.debug('Logger test: mensaje DEBUG');
    
    logger.http('Logger test: mensaje HTTP');

    logger.info('Logger test: mensaje INFO');

    logger.warning('Logger test: mensaje WARNING');

    logger.error('Logger test: mensaje ERROR');

    logger.fatal('Logger test: mensaje FATAL');

    res.status(200).json({
        status: 'success',
        message: 'Prueba de logger ejecutada correctamente'
    });
};