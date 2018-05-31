var express = require('express')
var router = express.Router()

// TODO DEV METHOD NEED DELETE
router.get('/users', function (req, res) {
  req.app.locals.db.collection('accounts').find({}).toArray().then(items => {
    console.log(items)
    res.send(items)
  })
})

router.get('/user/:id', function (req, res) {
  if (isNaN(parseInt(req.params.id))) {
    res.status(403).send({error: 'Incorrect user id'})
    return
  }
  req.app.locals.db.collection('accounts').findOne(
    {address: req.params.id},
    (err, item) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' })
      } else {
        res.send(item)
      }
    }
  )
})

router.post('/user', (req, res) => {
  console.log('req.body:')
  console.log(req.body)
  const user = {
    address: req.body.address,
    email: req.body.email,
    nick: req.body.nick
  }
  if (!req.body.address) {
    res.status(403).send({ 'error': 'Not valid data' })
    return
  }
  // db.collection.update(query, update, {upsert: true})

  req.app.locals.db.collection('accounts').update(
    {address: req.body.address},
    user,
    {upsert: true},
    (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred ' + err })
      } else {
        res.send(result)
      }
    }
  )
})

// module.exports = router;
module.exports = function (app, db) {
  app.locals.db = db
  app.use('/api', router)
}
