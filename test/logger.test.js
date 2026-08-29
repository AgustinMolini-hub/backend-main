import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';



describe('LOGGER API',()=>{


    it('GET /api/logger debe ejecutar prueba',async()=>{


        const res = await request(app)
            .get('/api/logger');


        expect(res.status)
            .equal(200);



        expect(res.body.status)
            .equal('success');


    });


});