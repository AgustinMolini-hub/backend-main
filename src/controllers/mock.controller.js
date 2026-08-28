import { MockService } from '../services/mock.service.js';

const mockService = new MockService();

export class MockController {
    static getUsers(req, res) {
        try {
            const quantity = Number(req.query.qty) || 1;

            if (quantity < 1 || quantity > 100) {
                return res.status(400).json({
                    status: 'error',
                    message: 'qty debe ser un número entre 1 y 100.'
                });
            }

            const users = mockService.generateUsers(quantity);

            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    static getDrivers(req, res) {
        try {
            const quantity = Number(req.query.qty) || 1;

            if (quantity < 1 || quantity > 100) {
                return res.status(400).json({
                    status: 'error',
                    message: 'qty debe ser un número entre 1 y 100.'
                });
            }

            const drivers = mockService.generateDrivers(quantity);

            return res.status(200).json(drivers);
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    static getAll(req, res) {
        try {
            const quantity = Number(req.query.qty) || 1;

            if (quantity < 1 || quantity > 100) {
                return res.status(400).json({
                    status: 'error',
                    message: 'qty debe ser un número entre 1 y 100.'
                });
            }

            const data = mockService.generateMockData(quantity);

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    static async seed(req, res) {
        try {
            const quantity = Number(req.query.qty) || 1;

            if (quantity < 1 || quantity > 100) {
                return res.status(400).json({
                    status: 'error',
                    message: 'qty debe ser un número entre 1 y 100.'
                });
            }

            const result = await mockService.seed(quantity);

            return res.status(201).json({
                status: 'success',
                message: 'Datos de prueba insertados correctamente.',
                ...result
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}
