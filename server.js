const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const db = require('knex')(configuration);

app.locals.title = 'Final EXAM WOO';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));


app.get('/api/v1/items', (request, response) => {
  db('garage_items').select('*')
  .then((data) => {
    response.status(200).json(data)
  })
  .catch((error) => {
    response.status(500).json(error)
  })
})

app.post('/api/v1/items', (request, response) => {
  db('garage_items').insert({
    name: request.body.name,
    reason: request.body.reason,
    cleanliness: request.body.cleanliness,
  }, '*')
  .then((data) => {
    response.status(201).json(data)
  })
  .catch((error) => {
    if (error.code === '23514') {
      return response.status(422).json({error: 'Cleanliness type is not allowed.  Try Sparkling, Dusty, or Rancid'})
    }
    response.status(500).json(error)
  })
})

app.put('/api/v1/items/:id', (request, response) => {
  db('garage_items').where('id', request.params.id)
  .update({
    cleanliness: request.body.cleanliness,
  }, '*')
  .then((data) => {
    if (!data.length) {
      return response.status(404).json({error: 'No entry exists'})
    }
    response.status(200).json(data)
  })
  .catch((error) => {
    if (error.code === '23514') {
      return response.status(422).json({error: 'Cleanliness type is not allowed.  Try Sparkling, Dusty, or Rancid'})
    }
    response.status(500).json(error)
  })
})

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
