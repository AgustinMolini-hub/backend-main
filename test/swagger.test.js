import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';



describe('SWAGGER',()=>{


    it('GET /api/docs debe existir',async()=>{


        const res = await request(app)
            .get('/api/docs');


        expect(res.status)
            .equal(200);


    });


});