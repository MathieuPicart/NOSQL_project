var express = require('express');
var router = express.Router();
var User = require('./../model/User')

router.post('/', function(req, res, next) {
  res.send({ msg : "Hello!" });
});

module.exports = router;
