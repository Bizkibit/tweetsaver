const express = require('express');
const bodyParser = require('body-parser');
const Twit = require('twit');

const config = {
    consumer_key:   'EBgasgZhLs3QZfq8nzx6VX96p'
  , consumer_secret:    'z3mKwwyTmCWZpVeBAlnnPgpZDm4UvQxQw0E3kG3Y77H97J4JFM'
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