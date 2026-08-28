import { expect } from 'chai';
import request from 'supertest';

import app from '../src/app.js';
import { UserModel } from '../src/models/user.model.js';
import { OrderModel } from '../src/models/order.model.js';
import { ORDER_STATUS } from '../src/constants/index.js';

describe('Orders API', function () {

    this.timeout(15000);

    let testUser;

    before(async function () {
        // Limpiamos únicamente los pedidos utilizados por los tests.
        await OrderModel.deleteMany({});

        // Creamos un usuario controlado para utilizar en los pedidos.
        await UserModel.deleteMany({
            email: 'usuario.order.test@test.com'
        });

        testUser = await UserModel.create({
            name: 'Usuario Order Test',
            email: 'usuario.order.test@test.com'
        });
    });

    beforeEach(async function () {
        // Cada test comienza sin pedidos previos.
        await OrderModel.deleteMany({});
    });

    after(async function () {
        // Limpieza de los datos creados durante la suite.
        await OrderModel.deleteMany({});

        if (testUser?._id) {
            await UserModel.deleteOne({
                _id: testUser._id
            });
        }
    });

    describe('GET /api/orders', function () {

        it('debe devolver 200 y una lista de pedidos', async function () {

            await OrderModel.create({
                user: testUser._id,
                total: 1500,
                status: ORDER_STATUS.PENDING
            });

            const response = await request(app)
                .get('/api/orders');

            expect(response.status).to.equal(200);

            expect(response.body).to.have.property(
                'status',
                'success'
            );

            expect(response.body).to.have.property('payload');

            expect(response.body.payload).to.be.an('array');

            expect(response.body.payload).to.have.lengthOf(1);

            const order = response.body.payload[0];

            expect(order).to.have.property('_id');

            expect(order).to.have.property('user');

            expect(order.user.toString()).to.equal(
                testUser._id.toString()
            );

            expect(order).to.have.property(
                'total',
                1500
            );

            expect(order).to.have.property(
                'status',
                ORDER_STATUS.PENDING
            );
        });

        it('debe devolver una lista vacía cuando no existen pedidos', async function () {

            const response = await request(app)
                .get('/api/orders');

            expect(response.status).to.equal(200);

            expect(response.body).to.have.property(
                'status',
                'success'
            );

            expect(response.body).to.have.property('payload');

            expect(response.body.payload).to.be.an('array');

            expect(response.body.payload).to.have.lengthOf(0);
        });
    });

    describe('POST /api/orders', function () {

        it('debe crear un pedido correctamente con datos válidos', async function () {

            const response = await request(app)
                .post('/api/orders')
                .send({
                    user: testUser._id.toString(),
                    total: 2500,
                    priority: 'HIGH'
                });

            expect(response.status).to.equal(201);

            expect(response.body).to.have.property(
                'status',
                'success'
            );

            expect(response.body).to.have.property('payload');

            const order = response.body.payload;

            expect(order).to.have.property('_id');

            expect(order).to.have.property('user');

            expect(order.user.toString()).to.equal(
                testUser._id.toString()
            );

            expect(order).to.have.property(
                'total',
                2500
            );

            expect(order).to.have.property(
                'priority',
                'HIGH'
            );

            expect(order).to.have.property(
                'status',
                ORDER_STATUS.PENDING
            );

            const orderInDatabase = await OrderModel.findById(
                order._id
            );

            expect(orderInDatabase).to.not.equal(null);

            expect(orderInDatabase.user.toString()).to.equal(
                testUser._id.toString()
            );
        });

        it('debe devolver 400 cuando faltan datos obligatorios', async function () {

            const response = await request(app)
                .post('/api/orders')
                .send({
                    total: 1000
                });

            expect(response.status).to.equal(400);

            expect(response.body).to.have.property(
                'status',
                'error'
            );

            expect(response.body).to.have.property('error');

            expect(response.body.error).to.have.property(
                'code',
                'INVALID_ORDER_DATA'
            );

            expect(response.body.error).to.have.property(
                'message'
            );

            expect(response.body.error).to.have.property(
                'details'
            );
        });

        it('debe devolver 404 cuando el usuario no existe', async function () {

            const fakeUserId = '507f1f77bcf86cd799439011';

            const response = await request(app)
                .post('/api/orders')
                .send({
                    user: fakeUserId,
                    total: 1000
                });

            expect(response.status).to.equal(404);

            expect(response.body).to.have.property(
                'status',
                'error'
            );

            expect(response.body).to.have.property('error');

            expect(response.body.error).to.have.property(
                'code',
                'USER_NOT_FOUND'
            );

            expect(response.body.error).to.have.property(
                'message'
            );

            expect(response.body.error).to.have.property(
                'details'
            );
        });
    });

    describe('GET /api/orders/:id', function () {

        it('debe devolver un pedido existente por ID', async function () {

            const order = await OrderModel.create({
                user: testUser._id,
                total: 3200,
                status: ORDER_STATUS.PENDING
            });

            const response = await request(app)
                .get(`/api/orders/${order._id}`);

            expect(response.status).to.equal(200);

            expect(response.body).to.have.property(
                'status',
                'success'
            );

            expect(response.body).to.have.property('payload');

            const responseOrder = response.body.payload;

            expect(responseOrder).to.have.property('_id');

            expect(responseOrder._id.toString()).to.equal(
                order._id.toString()
            );

            expect(responseOrder).to.have.property('user');

            expect(responseOrder.user.toString()).to.equal(
                testUser._id.toString()
            );

            expect(responseOrder).to.have.property(
                'total',
                3200
            );

            expect(responseOrder).to.have.property(
                'status',
                ORDER_STATUS.PENDING
            );
        });

        it('debe devolver 404 cuando el pedido no existe', async function () {

            const fakeOrderId = '507f1f77bcf86cd799439011';

            const response = await request(app)
                .get(`/api/orders/${fakeOrderId}`);

            expect(response.status).to.equal(404);

            expect(response.body).to.have.property(
                'status',
                'error'
            );

            expect(response.body).to.have.property('error');

            expect(response.body.error).to.have.property(
                'code',
                'ORDER_NOT_FOUND'
            );

            expect(response.body.error).to.have.property(
                'message',
                'Pedido no encontrado.'
            );

            expect(response.body.error).to.have.property(
                'details'
            );
        });
    });

    describe('PATCH /api/orders/:id/status', function () {

        it('debe actualizar correctamente el estado del pedido', async function () {

            const order = await OrderModel.create({
                user: testUser._id,
                total: 4500,
                status: ORDER_STATUS.PENDING
            });

            const response = await request(app)
                .patch(`/api/orders/${order._id}/status`)
                .send({
                    status: ORDER_STATUS.CONFIRMED
                });

            expect(response.status).to.equal(200);

            expect(response.body).to.have.property(
                'status',
                'success'
            );

            expect(response.body).to.have.property('payload');

            expect(response.body.payload).to.have.property(
                '_id'
            );

            expect(response.body.payload._id.toString()).to.equal(
                order._id.toString()
            );

            expect(response.body.payload).to.have.property(
                'status',
                ORDER_STATUS.CONFIRMED
            );

            const orderInDatabase = await OrderModel.findById(
                order._id
            );

            expect(orderInDatabase).to.not.equal(null);

            expect(orderInDatabase.status).to.equal(
                ORDER_STATUS.CONFIRMED
            );
        });

        it('debe devolver 400 cuando el estado es inválido', async function () {

            const order = await OrderModel.create({
                user: testUser._id,
                total: 5000,
                status: ORDER_STATUS.PENDING
            });

            const response = await request(app)
                .patch(`/api/orders/${order._id}/status`)
                .send({
                    status: 'ESTADO_INEXISTENTE'
                });

            expect(response.status).to.equal(400);

            expect(response.body).to.have.property(
                'status',
                'error'
            );

            expect(response.body).to.have.property('error');

            expect(response.body.error).to.have.property(
                'code',
                'INVALID_ORDER_STATUS'
            );

            expect(response.body.error).to.have.property(
                'message',
                'El estado del pedido no es válido.'
            );

            expect(response.body.error).to.have.property(
                'details'
            );
        });

        it('debe devolver 404 cuando se intenta actualizar un pedido inexistente', async function () {

            const fakeOrderId = '507f1f77bcf86cd799439011';

            const response = await request(app)
                .patch(`/api/orders/${fakeOrderId}/status`)
                .send({
                    status: ORDER_STATUS.CONFIRMED
                });

            expect(response.status).to.equal(404);

            expect(response.body).to.have.property(
                'status',
                'error'
            );

            expect(response.body).to.have.property('error');

            expect(response.body.error).to.have.property(
                'code',
                'ORDER_NOT_FOUND'
            );

            expect(response.body.error).to.have.property(
                'message',
                'Pedido no encontrado.'
            );

            expect(response.body.error).to.have.property(
                'details'
            );
        });
    });
});
