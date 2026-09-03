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

        await OrderModel.deleteMany({});

        await UserModel.deleteMany({
            email: 'usuario.order.test@test.com'
        });

        testUser = await UserModel.create({
            name: 'Usuario Order Test',
            email: 'usuario.order.test@test.com'
        });

    });


    beforeEach(async function () {

        await OrderModel.deleteMany({});

    });


    after(async function () {

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


        it('debe devolver 400 cuando el ID del usuario tiene un formato inválido', async function () {

            const response = await request(app)
                .post('/api/orders')
                .send({
                    user: 'id-invalido',
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
                'INVALID_USER_ID'
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


        it('debe devolver 400 cuando el ID del pedido tiene un formato inválido', async function () {

            const response = await request(app)
                .get('/api/orders/id-invalido');


            expect(response.status).to.equal(400);

            expect(response.body).to.have.property(
                'status',
                'error'
            );

            expect(response.body).to.have.property('error');

            expect(response.body.error).to.have.property(
                'code',
                'INVALID_ORDER_ID'
            );

            expect(response.body.error).to.have.property(
                'message'
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


        it('debe devolver 400 cuando el ID del pedido tiene un formato inválido', async function () {

            const response = await request(app)
                .patch('/api/orders/id-invalido/status')
                .send({
                    status: ORDER_STATUS.CONFIRMED
                });


            expect(response.status).to.equal(400);

            expect(response.body).to.have.property(
                'status',
                'error'
            );

            expect(response.body).to.have.property('error');

            expect(response.body.error).to.have.property(
                'code',
                'INVALID_ORDER_ID'
            );

            expect(response.body.error).to.have.property(
                'message'
            );

            expect(response.body.error).to.have.property(
                'details'
            );

        });

    });


    describe('POST /api/orders/:id/receipt', function () {

        it('debe subir correctamente un comprobante PDF', async function () {

            const order = await OrderModel.create({
                user: testUser._id,
                total: 1800,
                status: ORDER_STATUS.PENDING
            });


            const response = await request(app)
                .post(`/api/orders/${order._id}/receipt`)
                .attach(
                    'file',
                    Buffer.from('%PDF-1.4 comprobante de prueba'),
                    {
                        filename: 'comprobante-test.pdf',
                        contentType: 'application/pdf'
                    }
                );


            expect(response.status).to.equal(200);

            expect(response.body).to.have.property(
                'status',
                'success'
            );

            expect(response.body).to.have.property('payload');

            expect(response.body.payload).to.have.property(
                'receipt'
            );

            expect(response.body.payload.receipt).to.have.property(
                'originalName',
                'comprobante-test.pdf'
            );

            expect(response.body.payload.receipt).to.have.property(
                'mimetype',
                'application/pdf'
            );

            expect(response.body.payload.receipt).to.have.property(
                'filename'
            );

            expect(response.body.payload.receipt).to.have.property(
                'path'
            );

            expect(response.body.payload.receipt).to.have.property(
                'size'
            );

            expect(response.body.payload.receipt).to.have.property(
                'uploadedAt'
            );


            const orderInDatabase = await OrderModel.findById(
                order._id
            );


            expect(orderInDatabase).to.not.equal(null);

            expect(orderInDatabase.receipt).to.exist;

            expect(orderInDatabase.receipt.originalName).to.equal(
                'comprobante-test.pdf'
            );

            expect(orderInDatabase.receipt.mimetype).to.equal(
                'application/pdf'
            );

        });


        it('debe devolver 400 cuando no se envía archivo', async function () {

            const order = await OrderModel.create({
                user: testUser._id,
                total: 1900,
                status: ORDER_STATUS.PENDING
            });


            const response = await request(app)
                .post(`/api/orders/${order._id}/receipt`);


            expect(response.status).to.equal(400);

            expect(response.body).to.have.property(
                'status',
                'error'
            );

            expect(response.body).to.have.property('error');

            expect(response.body.error).to.have.property(
                'code',
                'FILE_REQUIRED'
            );

        });


        it('debe rechazar un tipo de archivo no permitido', async function () {

            const order = await OrderModel.create({
                user: testUser._id,
                total: 2000,
                status: ORDER_STATUS.PENDING
            });


            const response = await request(app)
                .post(`/api/orders/${order._id}/receipt`)
                .attach(
                    'file',
                    Buffer.from('archivo de texto no permitido'),
                    {
                        filename: 'comprobante.txt',
                        contentType: 'text/plain'
                    }
                );


            expect(response.status).to.equal(400);

            expect(response.body).to.have.property(
                'status',
                'error'
            );

            expect(response.body).to.have.property('error');

            expect(response.body.error).to.have.property(
                'code',
                'INVALID_FILE_TYPE'
            );

        });


        it('debe rechazar un archivo que supera el límite de tamaño', async function () {

            const order = await OrderModel.create({
                user: testUser._id,
                total: 2100,
                status: ORDER_STATUS.PENDING
            });


            const largeFile =
                Buffer.alloc(
                    (5 * 1024 * 1024) + 1,
                    1
                );


            const response = await request(app)
                .post(`/api/orders/${order._id}/receipt`)
                .attach(
                    'file',
                    largeFile,
                    {
                        filename: 'comprobante-grande.pdf',
                        contentType: 'application/pdf'
                    }
                );


            expect(response.status).to.equal(400);

            expect(response.body).to.have.property(
                'status',
                'error'
            );

            expect(response.body).to.have.property('error');

            expect(response.body.error).to.have.property(
                'code',
                'FILE_TOO_LARGE'
            );

        });


        it('debe devolver 404 cuando el pedido no existe', async function () {

            const fakeOrderId =
                '507f1f77bcf86cd799439011';


            const response = await request(app)
                .post(`/api/orders/${fakeOrderId}/receipt`)
                .attach(
                    'file',
                    Buffer.from('%PDF-1.4 comprobante inexistente'),
                    {
                        filename: 'comprobante-inexistente.pdf',
                        contentType: 'application/pdf'
                    }
                );


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

        });


        it('debe devolver 400 cuando el ID del pedido es inválido', async function () {

            const response = await request(app)
                .post('/api/orders/id-invalido/receipt')
                .attach(
                    'file',
                    Buffer.from('%PDF-1.4 comprobante ID invalido'),
                    {
                        filename: 'comprobante-id-invalido.pdf',
                        contentType: 'application/pdf'
                    }
                );


            expect(response.status).to.equal(400);

            expect(response.body).to.have.property(
                'status',
                'error'
            );

            expect(response.body).to.have.property('error');

            expect(response.body.error).to.have.property(
                'code',
                'INVALID_ORDER_ID'
            );

        });


        it('debe rechazar un campo de archivo incorrecto', async function () {

            const order = await OrderModel.create({
                user: testUser._id,
                total: 2200,
                status: ORDER_STATUS.PENDING
            });


            const response = await request(app)
                .post(`/api/orders/${order._id}/receipt`)
                .attach(
                    'document',
                    Buffer.from('%PDF-1.4 campo incorrecto'),
                    {
                        filename: 'comprobante-campo-invalido.pdf',
                        contentType: 'application/pdf'
                    }
                );


            expect(response.status).to.equal(400);

            expect(response.body).to.have.property(
                'status',
                'error'
            );

            expect(response.body).to.have.property('error');

            expect(response.body.error).to.have.property(
                'code',
                'INVALID_FILE_FIELD'
            );

        });

    });

});