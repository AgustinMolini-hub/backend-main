import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';


describe('Products API', ()=>{


    it('GET /api/products devuelve productos', async()=>{

        const response =
            await request(app)
            .get('/api/products');


        expect(response.status)
            .to.equal(200);


        expect(response.body.status)
            .to.equal('success');


        expect(response.body.payload)
            .to.be.an('array');

    });



    it('GET producto inexistente devuelve error', async()=>{

        const response =
            await request(app)
            .get('/api/products/6a91c0780e52f1b96d271149');


        expect(response.status)
            .to.equal(404);


        expect(response.body.error.code)
            .to.equal('PRODUCT_NOT_FOUND');

    });


});