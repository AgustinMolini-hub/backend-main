import { expect } from 'chai';
import request from 'supertest';

import app from '../src/app.js';


describe('GET /health', () => {

    it('debe devolver 200 y la estructura correcta', async () => {

        const response = await request(app)
            .get('/health');


        expect(response.status)
            .to.equal(200);


        expect(response.body)
            .to.be.an('object');


        expect(response.body)
            .to.have.property(
                'status',
                'ok'
            );


        expect(response.body)
            .to.have.property(
                'environment',
                'test'
            );


        expect(response.body)
            .to.have.property(
                'uptime'
            );

        expect(response.body.uptime)
            .to.be.a('number');

        expect(response.body.uptime)
            .to.be.at.least(0);


        expect(response.body)
            .to.have.property(
                'timestamp'
            );

        expect(response.body.timestamp)
            .to.be.a('string');


        expect(
            Number.isNaN(
                Date.parse(
                    response.body.timestamp
                )
            )
        ).to.equal(false);

    });

});