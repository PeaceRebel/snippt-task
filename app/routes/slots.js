var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Slot = require('../models/slot');

router.get('/', function(req, res){
  Slot.find(function(err, docs){
    if(!err){
      res.send(docs);
    }
    else{
      console.log("error!!!");
    }
  });
});

router.post('/', function(req, res){
  var date = req.body.date;
  var slot = req.body.slot;
  var alumni = req.body.alumni;
  var student = req.user.username;

  var newSlot = new Slot({
    date: date,
    slot: slot,
    alumni: alumni,
    student: student
  });
  //console.log('Slot: ' + JSON.stringify(newSlot));

  newSlot.save(function(err){
    if(!err){
      console.log('Slot saved successfully');
      res.redirect('/dashboard');
    }
    else {
      console.log('Error saving slot'+ JSON.stringify(err));
    }
  });
});

router.post('/confirm', function(req, res){
  var id = req.body.id;
  Slot.findByIdAndUpdate(id, { confirmed: true }, function(err, docs){
    if(!err){
      res.redirect('/dashboard');
    }
    else {
      console.log('Update Slot: Error: ' + JSON.stringify(err));
    }
  });
});


module.exports = router;
