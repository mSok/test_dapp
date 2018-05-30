var express = require('express');
var router = express.Router();

// TODO DEV METHOD NEED DELETE 
router.get('/users', function (req, res) {
    req.app.locals.db.collection("Acc").find({}).toArray().then( items => {
    console.log(items)
    res.send(items);
  })
})

router.get('/user/:id', function (req, res) {
  if (isNaN(parseInt(req.params.id))) {
      res.status(403).send({error: 'Incorrect user id'})
      return
  }
  req.app.locals.db.collection("Acc").find({id: parseInt(req.params.id)}).toArray().then( items => {
    res.send(items)
  })
})

// module.exports = router;
module.exports = function(app, db) {
    app.locals.db = db
    app.use('/api', router);
}
