// dev-server.js
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const db = require('./config/db')
const app = express()

app.set('port', 9000)
app.use(bodyParser.json())

MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  const dcContracts = database.db('contracts')
  console.log('mongo connected...')

  // Import routes
  require('./_routes')(app, dcContracts)
  app.listen(app.get('port'), () => {
    console.log('Node App Started at port 9000')
  })
})
