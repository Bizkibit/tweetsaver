const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()
const Twit = require('twit');

const config = {
    consumer_key:   process.env.CONSUMER_KEY || ''
  , consumer_secret:    process.env.CONSUMER_SECRET || ''
  , app_only_auth:        true
}
const twit = new Twit(config);

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/api/hello', (req, res) => {
//     twit.get('search/tweets', { q: 'banana since:2011-07-11', count: 10 }, function(err, data, response) {
//         res.send({ data })
//     })
// });

app.post('/api/', (req, res) => {
    console.log('req is', req.body);
    const {body: {query: q} = {}} = req;
    twit.get('search/tweets', { q, count: 10 }, function(err, data, response) {
        res.send({ data })
    })
  });

app.listen(port, () => console.log(`Listening on port ${port}`));