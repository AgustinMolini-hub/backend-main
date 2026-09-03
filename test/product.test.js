import { expect } from 'chai';
import request from 'supertest';

import app from '../src/app.js';
import { ProductModel } from '../src/models/product.model.js';



describe('Products API', function () {

    this.timeout(10000);


    beforeEach(async function () {

        await ProductModel.deleteMany({});

    });



    it(
        'GET /api/products devuelve productos con metadata de paginación',
        async function () {

            await ProductModel.create({

                name: 'Producto Test',

                price: 1000,

                stock: 5,

                status: 'AVAILABLE'

            });


            const response =
                await request(app)
                    .get('/api/products');


            expect(response.status)
                .to.equal(200);


            expect(response.body.status)
                .to.equal('success');


            expect(response.body.payload)
                .to.be.an('array');


            expect(response.body.payload)
                .to.have.lengthOf(1);


            expect(response.body.pagination)
                .to.deep.equal({

                    page: 1,

                    limit: 10,

                    total: 1,

                    totalPages: 1

                });

        }
    );



    it(
        'GET /api/products debe paginar correctamente los productos',
        async function () {

            await ProductModel.create([

                {
                    name: 'Producto 1',
                    price: 1000,
                    stock: 5,
                    status: 'AVAILABLE'
                },

                {
                    name: 'Producto 2',
                    price: 2000,
                    stock: 5,
                    status: 'AVAILABLE'
                },

                {
                    name: 'Producto 3',
                    price: 3000,
                    stock: 5,
                    status: 'AVAILABLE'
                }

            ]);


            const response =
                await request(app)
                    .get(
                        '/api/products?page=1&limit=2'
                    );


            expect(response.status)
                .to.equal(200);


            expect(response.body.payload)
                .to.be.an('array');


            expect(response.body.payload)
                .to.have.lengthOf(2);


            expect(response.body.pagination)
                .to.deep.equal({

                    page: 1,

                    limit: 2,

                    total: 3,

                    totalPages: 2

                });

        }
    );



    it(
        'GET /api/products debe limitar a 100 la cantidad máxima por página',
        async function () {

            const response =
                await request(app)
                    .get(
                        '/api/products?page=1&limit=500'
                    );


            expect(response.status)
                .to.equal(200);


            expect(response.body.pagination.page)
                .to.equal(1);


            expect(response.body.pagination.limit)
                .to.equal(100);

        }
    );



    it(
        'GET /api/products debe conservar el filtro available con paginación',
        async function () {

            await ProductModel.create([

                {
                    name: 'Disponible',
                    price: 1000,
                    stock: 5,
                    status: 'AVAILABLE'
                },

                {
                    name: 'Sin stock',
                    price: 1000,
                    stock: 0,
                    status: 'OUT_OF_STOCK'
                }

            ]);


            const response =
                await request(app)
                    .get(
                        '/api/products?available=true&page=1&limit=10'
                    );


            expect(response.status)
                .to.equal(200);


            expect(response.body.payload)
                .to.be.an('array');


            expect(response.body.payload)
                .to.have.lengthOf(1);


            expect(response.body.payload[0].status)
                .to.equal('AVAILABLE');


            expect(response.body.pagination)
                .to.deep.equal({

                    page: 1,

                    limit: 10,

                    total: 1,

                    totalPages: 1

                });

        }
    );



    it(
        'GET producto inexistente devuelve error',
        async function () {

            const response =
                await request(app)
                    .get(
                        '/api/products/507f1f77bcf86cd799439011'
                    );


            expect(response.status)
                .to.equal(404);


            expect(response.body.status)
                .to.equal('error');


            expect(response.body.error.code)
                .to.equal('PRODUCT_NOT_FOUND');

        }
    );

});