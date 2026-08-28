import { MockService } from '../services/mock.service.js';
import logger from '../config/logger.js';

const mockService = new MockService();

export class MockController {
    static getUsers(req, res, next) {
        try {
            const quantity = req.query.qty === undefined
                ? 1
                : Number(req.query.qty);

            mockService.validateQuantity(quantity);

            const users = mockService.generateUsers(quantity);

            return res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    static getDrivers(req, res, next) {
        try {
            const quantity = req.query.qty === undefined
                ? 1
                : Number(req.query.qty);

            mockService.validateQuantity(quantity);

            const drivers = mockService.generateDrivers(quantity);

            return res.status(200).json(drivers);
        } catch (error) {
            next(error);
        }
    }

    static getAll(req, res, next) {
        try {
            const quantity = req.query.qty === undefined
                ? 1
                : Number(req.query.qty);

            mockService.validateQuantity(quantity);

            const data = mockService.generateMockData(quantity);

            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    static async seed(req, res, next) {
        try {
            const quantity = req.query.qty === undefined
                ? 1
                : Number(req.query.qty);

            mockService.validateQuantity(quantity);

            const result = await mockService.seed(quantity);

            return res.status(201).json({
                status: 'success',
                message: 'Datos de prueba insertados correctamente.',
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    static testLogger(req, res) {
        logger.debug('Prueba de logger - nivel DEBUG');
        logger.http('Prueba de logger - nivel HTTP');
        logger.info('Prueba de logger - nivel INFO');
        logger.warning('Prueba de logger - nivel WARNING');
        logger.error('Prueba de logger - nivel ERROR');
        logger.fatal('Prueba de logger - nivel FATAL');

        return res.status(200).json({
            status: 'success',
            message: 'Prueba de logger ejecutada correctamente.'
        });
    }
}
