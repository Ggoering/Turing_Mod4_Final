const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const knex = require('knex')(configuration);

chai.use(chaiHttp);

describe('API Routes', () => {
  before((done) => {
    knex.migrate.latest()
      .then(() => done());
  });

  beforeEach((done) => {
    knex.seed.run()
      .then(() => done());
  });
  
  describe('GET /v1/items', () => {
    it('HAPPY PATH - should return all entries in the table', (done) => {
      chai.request(server)
        .get('/api/v1/items')
        .end((err, response) => {
          response.status.should.equal(200);
          response.should.be.json;
          response.body.length.should.equal(6)
          response.body[0].should.have.property('name')
          response.body[0].name.should.equal('Luna')
          response.body[0].should.have.property('id')
          response.body[0].id.should.equal(1)
          response.body[0].should.have.property('reason')
          response.body[0].reason.should.equal('BAD DOG')
          response.body[0].should.have.property('cleanliness')
          response.body[0].cleanliness.should.equal('Dusty')
          done()
        })
    })
  })
  
  // describe('POST /v1/items', () => {
  //   it('HAPPY PATH - insert an entry into the table', (done) => {
  //     const newEntry = {
  //       id: 9, 
  //       name: 'old books', 
  //       reason: 'too lazy to take them to store', 
  //       cleanliness: 'Sparkling'
  //     }
  //     chai.request(server)
  //       .post('/api/v1/items')
  //       .send(newEntry)
  //       .end((err, response) => {
  //         console.log(response)
  //         response.status.should.equal(201);
  //         response.should.be.json;
  //         response.length.should.equal(1)
  //         response[0].should.have.property('name')
  //         response[0].name.should.equal('old books')
  //         response[0].should.have.property('id')
  //         response[0].id.should.equal(7)
  //         response[0].should.have.property('reason')
  //         response[0].reason.should.equal('too lazy to take them to store')
  //         response[0].should.have.property('cleanliness')
  //         response[0].cleanliness.should.equal('Dusty')
  //         done()
  //       })
  //   })
  // })
  
});