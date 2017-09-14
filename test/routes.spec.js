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
          response.body[0].should.have.property('reason')
          response.body[0].reason.should.equal('BAD DOG')
          response.body[0].should.have.property('cleanliness')
          response.body[0].cleanliness.should.equal('Dusty')
          done()
        })
    })
  })
  
  describe('POST /v1/items', () => {
    it('HAPPY PATH - insert an entry into the table, return value', (done) => {
      const newEntry = {
        name: 'old books', 
        reason: 'too lazy to take them to store', 
        cleanliness: 'Sparkling',
        id: 7,
      };
      chai.request(server)
        .post('/api/v1/items')
        .send(newEntry)
        .end((err, response) => {
          response.status.should.equal(201);
          response.should.be.json;
          response.body.length.should.equal(1)
          response.body[0].should.have.property('name')
          response.body[0].name.should.equal('old books')
          response.body[0].should.have.property('id')
          response.body[0].should.have.property('reason')
          response.body[0].reason.should.equal('too lazy to take them to store')
          response.body[0].should.have.property('cleanliness')
          response.body[0].cleanliness.should.equal('Sparkling')
          done()
        })
    })
    
      it('SAD PATH - attempted to insert a disallowed cleanliness value', (done) => {
        const newEntry = {
          name: 'old books', 
          reason: 'too lazy to take them to store', 
          cleanliness: 'whatever',
        };
        chai.request(server)
          .post('/api/v1/items')
          .send(newEntry)
          .end((err, response) => {
            response.status.should.equal(422);
            response.should.be.json;
            response.body.error.should.equal('Cleanliness type is not allowed.  Try Sparkling, Dusty, or Rancid')
            done()
          })
      })
  })
  
  describe('PUT /v1/items', () => {
    it.skip('HAPPY PATH - update cleanliness in table', (done) => {
      const newEntry = {
        cleanliness: 'Sparkling',
      };
      chai.request(server)
      //get itemId so that we can update
        .get('/api/v1/items')
        .end((err, response) => {
          response.body[0].cleanliness.should.equal('Dusty');
          console.log('here')
          chai.request(server)
            .put(`/api/v1/items/${response.body[0].id}`)
            .send(newEntry)
            .end((err2, response2) => {
              response2.status.should.equal(301)
              response.should.be.json;
              response2.body.length.should.equal(1)
              response2.body[0].should.have.property('name')
              response2.body[0].name.should.equal('Luna')
              response2.body[0].should.have.property('id')
              response2.body[0].should.have.property('reason')
              response2.body[0].reason.should.equal('BAD DOG')
              response2.body[0].should.have.property('cleanliness')
              response2.body[0].cleanliness.should.equal('Sparkling')
              done()
          })
        })
    })
    
      it.skip('SAD PATH - attempted to insert a disallowed cleanliness value', (done) => {
        const newEntry = {
          cleanliness: 'whatever',
        };
        .get('/api/v1/items')
        .end((err, response) => {
          chai.request(server)
            .put(`/api/v1/items/${response.body[0].id}`)
            .send(newEntry)
            .end((err2, response2) => {
              response2.status.should.equal(422);
              response2.should.be.json;
              response2.body.error.should.equal('Cleanliness type is not allowed.  Try Sparkling, Dusty, or Rancid')
              done()
            })
        })    
      })
      
      
      it.skip('SAD PATH - attempted to insert a disallowed cleanliness value', (done) => {
        const newEntry = {
          cleanliness: 'whatever',
        };
        chai.request(server)
          .put(`/api/v1/items/99999999`)
          .send(newEntry)
          .end((err2, response2) => {
            response2.status.should.equal(404);
            response2.should.be.json;
            done()
          })
      })
  })
  
});