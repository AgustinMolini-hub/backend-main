import { Router } from 'express';
import { MockController } from '../controllers/mock.controller.js';

const router = Router();

/**
 * @swagger
 * /api/logger:
 *   get:
 *     tags:
 *       - Logger
 *     summary: Endpoint de prueba del sistema de logging
 *     description: Ejecuta todos los niveles de Winston para verificar la configuración del logger.
 *     responses:
 *       200:
 *         description: Prueba de logger ejecutada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Prueba de logger ejecutada correctamente.
 */
router.get(
    '/logger',
    MockController.testLogger
);


export default router;