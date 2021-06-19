const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb+srv://pmpknu:BNv2a6di5MnZeKB7@cluster0.pib3g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('star-wars-quotes');
    const quotesCollection = db.collection('quotes');

    /* before use, get, post... */
    app.set('view engine', 'ejs');
    // !!! Make sure you place body-parser before your CRUD handlers!
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
        .then(results => {
          res.render('index.ejs', { quotes: results });
        })
        .catch(error => console.error(error));
      //res.render('index.ejs', {});
      //res.sendFile(__dirname + '/index.html');
    });

    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => { res.redirect('/'); })
        .catch(error => console.error(error))
    })

    app.listen(30, function () {
      console.log('listening on 30');
    });
  })
  .catch(error => console.error(error));
