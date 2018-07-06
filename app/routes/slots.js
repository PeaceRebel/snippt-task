var express = require('express');
var router = express.Router();
var moment = require('moment');

var User = require('../models/user');
var Slot = require('../models/slot');

router.get('/', ensureAuthenticated, function(req, res){
  Slot.find(function(err, docs){
    if(!err){
      res.send(docs);
    }
    else{
      console.log("error!!!");
    }
  });
});

router.post('/', ensureAuthenticated, function(req, res){
  if(req.user.permission == 'student'){
    var date = req.body.date;
    var slot = req.body.slot;
    var alumni = req.body.alumni;
    var student = req.user.username;

    Slot.pendingSlots(student, function(err, docs){
      if(!err){
        if(docs.length){
          // If there are slots booked by 'student' to be confirmed by 'alumnus'.
          req.flash('error_msg', 'You have a slot yet to be confirmed.');
          res.redirect('/dashboard');
        }
        else {
          // If there's no slot booked by this 'student' that 'alumnus' did not confirm.
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
        }
      }
      else{
        console.error('Error Pending slots: ' + JSON.stringify(docs));
      }
    });
  }
  else {
    req.flash('error_msg', 'You are not authorized to do this.');
    res.redirect('/');
  }
});

router.post('/confirm', ensureAuthenticated, function(req, res){
  if(req.user.permission == 'alumni'){
    var id = req.body.id;
    Slot.findByIdAndUpdate(id, { confirmed: true }, function(err, docs){
      if(!err){
        res.redirect('/dashboard');
      }
      else {
        console.log('Update Slot: Error: ' + JSON.stringify(err));
      }
    });
  }
  else {
    req.flash('error_msg', 'You are not authorized to do this.');
    res.redirect('/');
  }
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    res.redirect('/users/login');
  }
}

module.exports = router;
