import { Router } from 'express';
import { MockController } from '../controllers/mock.controller.js';

const router = Router();


/**
 * @swagger
 * /api/mocks/users:
 *   get:
 *     tags:
 *       - Mocks
 *     summary: Generar usuarios simulados
 *     description: Genera usuarios mock en memoria sin almacenarlos en MongoDB.
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 1
 *         description: Cantidad de usuarios a generar.
 *     responses:
 *       200:
 *         description: Usuarios simulados generados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Cantidad inválida o fuera de rango.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/users', MockController.getUsers);



/**
 * @swagger
 * /api/mocks/drivers:
 *   get:
 *     tags:
 *       - Mocks
 *     summary: Generar repartidores simulados
 *     description: Genera usuarios con rol DRIVER sin almacenarlos en MongoDB.
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 1
 *         description: Cantidad de repartidores a generar.
 *     responses:
 *       200:
 *         description: Repartidores simulados generados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Cantidad inválida o fuera de rango.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/drivers', MockController.getDrivers);



/**
 * @swagger
 * /api/mocks/all:
 *   get:
 *     tags:
 *       - Mocks
 *     summary: Generar datos mock completos
 *     description: Genera usuarios, repartidores, pedidos y entregas relacionados en memoria.
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 1
 *         description: Cantidad de usuarios y pedidos a generar.
 *     responses:
 *       200:
 *         description: Datos mock generados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 drivers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 deliveries:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Cantidad inválida o fuera de rango.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/all', MockController.getAll);



/**
 * @swagger
 * /api/mocks/seed:
 *   post:
 *     tags:
 *       - Mocks
 *     summary: Insertar datos mock en MongoDB
 *     description: Genera e inserta usuarios, repartidores, pedidos y entregas de prueba en MongoDB.
 *
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 1
 *         description: Cantidad de registros de prueba a generar.
 *
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               qty:
 *                 type: integer
 *                 example: 10
 *           example:
 *             qty: 10
 *
 *     responses:
 *       201:
 *         description: Datos de prueba insertados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MockSeedResponse'
 *
 *       400:
 *         description: Cantidad inválida o fuera del máximo permitido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       500:
 *         description: Error durante la inserción de datos mock.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/seed', MockController.seed);



export default router;