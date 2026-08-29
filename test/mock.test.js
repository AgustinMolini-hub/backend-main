import { expect } from 'chai';
import request from 'supertest';

import app from '../src/app.js';


describe('Mocks API', ()=>{


    it('GET /api/mocks/users genera usuarios mock', async()=>{


        const response =
            await request(app)
            .get('/api/mocks/users?qty=2');


        expect(response.status)
            .to.equal(200);


        expect(response.body)
            .to.have.property('status');


        expect(response.body.payload)
            .to.be.an('array');


        expect(response.body.payload.length)
            .to.equal(2);


    });



    it('GET /api/mocks/drivers genera repartidores mock', async()=>{


        const response =
            await request(app)
            .get('/api/mocks/drivers?qty=2');


        expect(response.status)
            .to.equal(200);


        expect(response.body.payload)
            .to.be.an('array');


    });



    it('GET /api/mocks/all genera datos relacionados', async()=>{


        const response =
            await request(app)
            .get('/api/mocks/all?qty=2');


        expect(response.status)
            .to.equal(200);


        expect(response.body.payload)
            .to.have.property('users');


        expect(response.body.payload)
            .to.have.property('orders');


        expect(response.body.payload)
            .to.have.property('deliveries');


    });



    it('GET /api/mocks/users rechaza cantidad inválida', async()=>{


        const response =
            await request(app)
            .get('/api/mocks/users?qty=-5');


        expect(response.status)
            .to.equal(400);


        expect(response.body.error)
            .to.have.property('code');


    });



});