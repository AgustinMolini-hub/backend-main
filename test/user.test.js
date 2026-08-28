import { expect } from 'chai';
import request from 'supertest';

import app from '../src/app.js';
import { UserModel } from '../src/models/user.model.js';

describe('Users API', function () {

    beforeEach(async function () {
        await UserModel.deleteMany({});
    });

    afterEach(async function () {
        await UserModel.deleteMany({});
    });

    describe('GET /api/users', function () {

        it('debe devolver 200 y una lista de usuarios', async function () {
            await UserModel.create({
                name: 'Usuario Test',
                email: 'usuario.test@test.com'
            });

            const response = await request(app)
                .get('/api/users');

            expect(response.status).to.equal(200);

            expect(response.body).to.have.property(
                'status',
                'success'
            );

            expect(response.body).to.have.property('payload');

            expect(response.body.payload).to.be.an('array');

            expect(response.body.payload).to.have.lengthOf(1);

            expect(response.body.payload[0]).to.have.property(
                'name',
                'Usuario Test'
            );

            expect(response.body.payload[0]).to.have.property(
                'email',
                'usuario.test@test.com'
            );
        });

        it('debe devolver una lista vacía cuando no existen usuarios', async function () {
            const response = await request(app)
                .get('/api/users');

            expect(response.status).to.equal(200);

            expect(response.body).to.have.property(
                'status',
                'success'
            );

            expect(response.body.payload).to.be.an('array');

            expect(response.body.payload).to.have.lengthOf(0);
        });
    });

    describe('POST /api/users', function () {

        it('debe crear un usuario correctamente', async function () {
            const response = await request(app)
                .post('/api/users')
                .send({
                    name: 'Usuario Creado',
                    email: 'usuario.creado@test.com'
                });

            expect(response.status).to.equal(201);

            expect(response.body).to.have.property(
                'status',
                'success'
            );

            expect(response.body).to.have.property('payload');

            expect(response.body.payload).to.have.property(
                'name',
                'Usuario Creado'
            );

            expect(response.body.payload).to.have.property(
                'email',
                'usuario.creado@test.com'
            );

            expect(response.body.payload).to.have.property('_id');

            const userInDatabase = await UserModel.findOne({
                email: 'usuario.creado@test.com'
            });

            expect(userInDatabase).to.not.equal(null);
        });

        it('debe devolver 400 cuando faltan datos obligatorios', async function () {
            const response = await request(app)
                .post('/api/users')
                .send({
                    name: 'Usuario Incompleto'
                });

            expect(response.status).to.equal(400);

            expect(response.body).to.have.property(
                'status',
                'error'
            );

            expect(response.body).to.have.property('error');

            expect(response.body.error).to.have.property(
                'code',
                'INVALID_USER_DATA'
            );

            expect(response.body.error).to.have.property('message');

            expect(response.body.error).to.have.property('details');
        });

        it('debe devolver 400 cuando falta el nombre', async function () {
            const response = await request(app)
                .post('/api/users')
                .send({
                    email: 'sin.nombre@test.com'
                });

            expect(response.status).to.equal(400);

            expect(response.body).to.have.property(
                'status',
                'error'
            );

            expect(response.body.error).to.have.property(
                'code',
                'INVALID_USER_DATA'
            );
        });

        it('debe devolver 400 cuando falta el email', async function () {
            const response = await request(app)
                .post('/api/users')
                .send({
                    name: 'Sin Email'
                });

            expect(response.status).to.equal(400);

            expect(response.body).to.have.property(
                'status',
                'error'
            );

            expect(response.body.error).to.have.property(
                'code',
                'INVALID_USER_DATA'
            );
        });

        it('debe devolver 400 cuando el email ya existe', async function () {
            await UserModel.create({
                name: 'Usuario Existente',
                email: 'duplicado@test.com'
            });

            const response = await request(app)
                .post('/api/users')
                .send({
                    name: 'Segundo Usuario',
                    email: 'duplicado@test.com'
                });

            expect(response.status).to.equal(400);

            expect(response.body).to.have.property(
                'status',
                'error'
            );

            expect(response.body).to.have.property('error');

            expect(response.body.error).to.have.property(
                'code',
                'USER_ALREADY_EXISTS'
            );

            expect(response.body.error).to.have.property('message');

            expect(response.body.error).to.have.property('details');
        });
    });
});
