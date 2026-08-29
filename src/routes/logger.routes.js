import { Router } from 'express';

import { testLogger } from '../controllers/logger.controller.js';


const router = Router();



/**
 * @swagger
 * /api/logger-test:
 *   get:
 *     tags:
 *       - Logger
 *     summary: Prueba del sistema de logging
 *     description: Genera logs de todos los niveles configurados en Winston.
 *     responses:
 *       200:
 *         description: Logger probado correctamente
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Prueba de logger ejecutada correctamente
 *
 */


router.get(
    '/logger-test',
    testLogger
);



export default router;