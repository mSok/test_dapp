// dev-server.js
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const db = require('./config/db');
const app = express();

// Import routes
// var api = require('./_routes');

app.set('port', 9000);
MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err)
    const db_c = database.db("contracts");
    console.log('mongo connected...');
    // Import routes
    require('./_routes')(app, db_c);
    app.listen(app.get('port'), () => {
        console.log('Node App Started at port 9000');
    })
})
