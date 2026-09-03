import { expect } from 'chai';
import request from 'supertest';
import fs from 'fs/promises';
import path from 'path';

import app from '../src/app.js';
import { UserModel } from '../src/models/user.model.js';

import { DOCUMENT_TYPES } from '../src/constants/index.js';


describe('Users API', function () {

    this.timeout(15000);

    let testUser;

    const testFilesPath =
        path.join(process.cwd(), 'test', 'fixtures');

    const validPdfPath =
        path.join(testFilesPath, 'documento-test.pdf');

    const validPngPath =
        path.join(testFilesPath, 'documento-test.png');

    const invalidTxtPath =
        path.join(testFilesPath, 'documento-test.txt');

    const largeFilePath =
        path.join(testFilesPath, 'documento-grande.pdf');


    before(async function () {

        await fs.mkdir(
            testFilesPath,
            {
                recursive: true
            }
        );


        /*
         * Archivo PDF válido mínimo para los tests.
         */
        await fs.writeFile(
            validPdfPath,
            Buffer.from(
                '%PDF-1.4\n% ShipNow test document\n'
            )
        );


        /*
         * PNG válido mínimo.
         */
        await fs.writeFile(
            validPngPath,
            Buffer.from([
                0x89,
                0x50,
                0x4E,
                0x47,
                0x0D,
                0x0A,
                0x1A,
                0x0A
            ])
        );


        /*
         * Archivo con extensión/tipo no permitido.
         */
        await fs.writeFile(
            invalidTxtPath,
            'Archivo de prueba inválido'
        );


        /*
         * Archivo superior al límite configurado
         * en Multer: 5 MB.
         */
        const largeBuffer =
            Buffer.alloc(
                5 * 1024 * 1024 + 1024,
                'a'
            );


        await fs.writeFile(
            largeFilePath,
            largeBuffer
        );

    });


    after(async function () {

        try {

            await fs.rm(
                testFilesPath,
                {
                    recursive: true,
                    force: true
                }
            );

        } catch (error) {

            // No interrumpimos los tests por errores de limpieza.

        }

    });


    beforeEach(async function () {

        await UserModel.deleteMany({});


        testUser =
            await UserModel.create({

                name: 'Usuario Test',

                email: 'usuario.test@test.com'

            });

    });


    afterEach(async function () {

        await UserModel.deleteMany({});

    });


    describe('GET /api/users', function () {


        it('debe devolver 200 y una lista de usuarios', async function () {

            const response =
                await request(app)
                    .get('/api/users');


            expect(response.status)
                .to.equal(200);


            expect(response.body)
                .to.have.property(
                    'status',
                    'success'
                );


            expect(response.body)
                .to.have.property(
                    'payload'
                );


            expect(response.body.payload)
                .to.be.an('array');


            expect(response.body.payload)
                .to.have.lengthOf(1);


            expect(response.body.payload[0])
                .to.have.property(
                    'name',
                    'Usuario Test'
                );


            expect(response.body.payload[0])
                .to.have.property(
                    'email',
                    'usuario.test@test.com'
                );


            expect(response.body)
                .to.have.property(
                    'pagination'
                );


            expect(response.body.pagination)
                .to.include({
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1
                });

        });


        it('debe devolver una lista vacía cuando no existen usuarios', async function () {

            await UserModel.deleteMany({});


            const response =
                await request(app)
                    .get('/api/users');


            expect(response.status)
                .to.equal(200);


            expect(response.body)
                .to.have.property(
                    'status',
                    'success'
                );


            expect(response.body.payload)
                .to.be.an('array');


            expect(response.body.payload)
                .to.have.lengthOf(0);


            expect(response.body)
                .to.have.property(
                    'pagination'
                );


            expect(response.body.pagination)
                .to.include({
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 0
                });

        });


        it('debe paginar correctamente los usuarios', async function () {

            await UserModel.create([
                {
                    name: 'Usuario Paginado 1',
                    email: 'paginado1@test.com'
                },
                {
                    name: 'Usuario Paginado 2',
                    email: 'paginado2@test.com'
                },
                {
                    name: 'Usuario Paginado 3',
                    email: 'paginado3@test.com'
                }
            ]);


            const response =
                await request(app)
                    .get('/api/users?page=1&limit=2');


            expect(response.status)
                .to.equal(200);


            expect(response.body)
                .to.have.property(
                    'status',
                    'success'
                );


            expect(response.body.payload)
                .to.be.an('array');


            expect(response.body.payload)
                .to.have.lengthOf(2);


            expect(response.body)
                .to.have.property(
                    'pagination'
                );


            expect(response.body.pagination)
                .to.include({
                    page: 1,
                    limit: 2,
                    total: 4,
                    totalPages: 2
                });

        });


        it('debe limitar a 100 la cantidad máxima de usuarios por página', async function () {

            const response =
                await request(app)
                    .get('/api/users?page=1&limit=500');


            expect(response.status)
                .to.equal(200);


            expect(response.body)
                .to.have.property(
                    'pagination'
                );


            expect(response.body.pagination.limit)
                .to.equal(100);


            expect(response.body.payload)
                .to.be.an('array');


            expect(response.body.payload.length)
                .to.be.at.most(100);

        });

    });


    describe('POST /api/users', function () {


        it('debe crear un usuario correctamente', async function () {

            const response =
                await request(app)
                    .post('/api/users')
                    .send({

                        name: 'Usuario Creado',

                        email: 'usuario.creado@test.com'

                    });


            expect(response.status)
                .to.equal(201);


            expect(response.body)
                .to.have.property(
                    'status',
                    'success'
                );


            expect(response.body)
                .to.have.property(
                    'payload'
                );


            expect(response.body.payload)
                .to.have.property(
                    'name',
                    'Usuario Creado'
                );


            expect(response.body.payload)
                .to.have.property(
                    'email',
                    'usuario.creado@test.com'
                );


            expect(response.body.payload)
                .to.have.property('_id');


            const userInDatabase =
                await UserModel.findOne({

                    email:
                        'usuario.creado@test.com'

                });


            expect(userInDatabase)
                .to.not.equal(null);

        });


        it('debe devolver 400 cuando faltan datos obligatorios', async function () {

            const response =
                await request(app)
                    .post('/api/users')
                    .send({

                        name:
                            'Usuario Incompleto'

                    });


            expect(response.status)
                .to.equal(400);


            expect(response.body)
                .to.have.property(
                    'status',
                    'error'
                );


            expect(response.body)
                .to.have.property('error');


            expect(response.body.error)
                .to.have.property(
                    'code',
                    'INVALID_USER_DATA'
                );


            expect(response.body.error)
                .to.have.property('message');


            expect(response.body.error)
                .to.have.property('details');

        });


        it('debe devolver 400 cuando falta el nombre', async function () {

            const response =
                await request(app)
                    .post('/api/users')
                    .send({

                        email:
                            'sin.nombre@test.com'

                    });


            expect(response.status)
                .to.equal(400);


            expect(response.body)
                .to.have.property(
                    'status',
                    'error'
                );


            expect(response.body.error)
                .to.have.property(
                    'code',
                    'INVALID_USER_DATA'
                );

        });


        it('debe devolver 400 cuando falta el email', async function () {

            const response =
                await request(app)
                    .post('/api/users')
                    .send({

                        name:
                            'Sin Email'

                    });


            expect(response.status)
                .to.equal(400);


            expect(response.body)
                .to.have.property(
                    'status',
                    'error'
                );


            expect(response.body.error)
                .to.have.property(
                    'code',
                    'INVALID_USER_DATA'
                );

        });


        it('debe devolver 400 cuando el email ya existe', async function () {

            await UserModel.create({

                name:
                    'Usuario Existente',

                email:
                    'duplicado@test.com'

            });


            const response =
                await request(app)
                    .post('/api/users')
                    .send({

                        name:
                            'Segundo Usuario',

                        email:
                            'duplicado@test.com'

                    });


            expect(response.status)
                .to.equal(400);


            expect(response.body)
                .to.have.property(
                    'status',
                    'error'
                );


            expect(response.body)
                .to.have.property(
                    'error'
                );


            expect(response.body.error)
                .to.have.property(
                    'code',
                    'USER_ALREADY_EXISTS'
                );


            expect(response.body.error)
                .to.have.property('message');


            expect(response.body.error)
                .to.have.property('details');

        });

    });


    describe('POST /api/users/:id/documents', function () {


        it('debe subir correctamente un documento PDF', async function () {

            const response =
                await request(app)
                    .post(
                        `/api/users/${testUser._id}/documents`
                    )
                    .field(
                        'documentType',
                        DOCUMENT_TYPES.DNI
                    )
                    .attach(
                        'file',
                        validPdfPath
                    );


            expect(response.status)
                .to.equal(200);


            expect(response.body)
                .to.have.property(
                    'status',
                    'success'
                );


            expect(response.body)
                .to.have.property(
                    'payload'
                );


            expect(response.body.payload)
                .to.have.property('_id');


            expect(response.body.payload)
                .to.have.property('documents');


            expect(response.body.payload.documents)
                .to.be.an('array');


            expect(response.body.payload.documents)
                .to.have.lengthOf(1);


            const document =
                response.body.payload.documents[0];


            expect(document)
                .to.have.property(
                    'originalName'
                );


            expect(document)
                .to.have.property(
                    'filename'
                );


            expect(document)
                .to.have.property(
                    'path'
                );


            expect(document)
                .to.have.property(
                    'mimetype'
                );


            expect(document)
                .to.have.property(
                    'size'
                );


            expect(document)
                .to.have.property(
                    'documentType',
                    DOCUMENT_TYPES.DNI
                );


            expect(document)
                .to.have.property(
                    'uploadedAt'
                );

        });


        it('debe subir correctamente un documento PNG', async function () {

            const response =
                await request(app)
                    .post(
                        `/api/users/${testUser._id}/documents`
                    )
                    .field(
                        'documentType',
                        DOCUMENT_TYPES.OTHER
                    )
                    .attach(
                        'file',
                        validPngPath
                    );


            expect(response.status)
                .to.equal(200);


            expect(response.body)
                .to.have.property(
                    'status',
                    'success'
                );


            expect(response.body.payload.documents)
                .to.be.an('array');


            expect(response.body.payload.documents)
                .to.have.lengthOf(1);


            expect(response.body.payload.documents[0])
                .to.have.property(
                    'documentType',
                    DOCUMENT_TYPES.OTHER
                );

        });


        it('debe devolver 400 cuando no se envía archivo', async function () {

            const response =
                await request(app)
                    .post(
                        `/api/users/${testUser._id}/documents`
                    )
                    .field(
                        'documentType',
                        DOCUMENT_TYPES.DNI
                    );


            expect(response.status)
                .to.equal(400);


            expect(response.body)
                .to.have.property(
                    'status',
                    'error'
                );


            expect(response.body.error)
                .to.have.property(
                    'code',
                    'FILE_REQUIRED'
                );

        });


        it('debe rechazar un tipo de archivo no permitido', async function () {

            const response =
                await request(app)
                    .post(
                        `/api/users/${testUser._id}/documents`
                    )
                    .field(
                        'documentType',
                        DOCUMENT_TYPES.DNI
                    )
                    .attach(
                        'file',
                        invalidTxtPath
                    );


            expect(response.status)
                .to.equal(400);


            expect(response.body)
                .to.have.property(
                    'status',
                    'error'
                );


            expect(response.body)
                .to.have.property(
                    'error'
                );


            expect(response.body.error)
                .to.have.property(
                    'code',
                    'INVALID_FILE_TYPE'
                );

        });


        it('debe rechazar un archivo que supera el límite de tamaño', async function () {

            const response =
                await request(app)
                    .post(
                        `/api/users/${testUser._id}/documents`
                    )
                    .field(
                        'documentType',
                        DOCUMENT_TYPES.DNI
                    )
                    .attach(
                        'file',
                        largeFilePath
                    );


            expect(response.status)
                .to.equal(400);


            expect(response.body)
                .to.have.property(
                    'status',
                    'error'
                );


            expect(response.body.error)
                .to.have.property(
                    'code'
                );

        });


        it('debe devolver 404 cuando el usuario no existe', async function () {

            const fakeUserId =
                '507f1f77bcf86cd799439011';


            const response =
                await request(app)
                    .post(
                        `/api/users/${fakeUserId}/documents`
                    )
                    .field(
                        'documentType',
                        DOCUMENT_TYPES.DNI
                    )
                    .attach(
                        'file',
                        validPdfPath
                    );


            expect(response.status)
                .to.equal(404);


            expect(response.body)
                .to.have.property(
                    'status',
                    'error'
                );


            expect(response.body.error)
                .to.have.property(
                    'code',
                    'USER_NOT_FOUND'
                );

        });


        it('debe devolver 400 cuando el ID del usuario es inválido', async function () {

            const response =
                await request(app)
                    .post(
                        '/api/users/id-invalido/documents'
                    )
                    .field(
                        'documentType',
                        DOCUMENT_TYPES.DNI
                    )
                    .attach(
                        'file',
                        validPdfPath
                    );


            expect(response.status)
                .to.equal(400);


            expect(response.body)
                .to.have.property(
                    'status',
                    'error'
                );


            expect(response.body.error)
                .to.have.property(
                    'code',
                    'INVALID_USER_ID'
                );

        });


        it('debe rechazar un tipo de documento inválido', async function () {

            const response =
                await request(app)
                    .post(
                        `/api/users/${testUser._id}/documents`
                    )
                    .field(
                        'documentType',
                        'DOCUMENTO_INEXISTENTE'
                    )
                    .attach(
                        'file',
                        validPdfPath
                    );


            expect(response.status)
                .to.equal(400);


            expect(response.body)
                .to.have.property(
                    'status',
                    'error'
                );


            expect(response.body.error)
                .to.have.property(
                    'code',
                    'INVALID_DOCUMENT_TYPE'
                );

        });


        it('debe rechazar un campo de archivo incorrecto', async function () {

            const response =
                await request(app)
                    .post(
                        `/api/users/${testUser._id}/documents`
                    )
                    .field(
                        'documentType',
                        DOCUMENT_TYPES.DNI
                    )
                    .attach(
                        'document',
                        validPdfPath
                    );


            expect(response.status)
                .to.equal(400);


            expect(response.body)
                .to.have.property(
                    'status',
                    'error'
                );


            expect(response.body)
                .to.have.property(
                    'error'
                );

        });

    });

});