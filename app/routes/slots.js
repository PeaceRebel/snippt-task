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

    if(req.user.slots_booked < 2){
      var date = req.body.date;

      if( (moment().add(7, 'days').format('YYYY-MM-DD') >= date) &&
      moment().add(1, 'days').format('YYYY-MM-DD') <= date){
        var slot = req.body.slot;
        var alumni = req.body.alumni;
        var student = req.user.username;

        var slots_booked = req.user.slots_booked + 1;

        Slot.pendingSlots(student, function(err, docs){
          if(!err){
            if(docs.length){
              // If there are slots booked by 'student' to be confirmed by 'alumnus'.
              req.flash('error_msg', 'You have a slot yet to be confirmed.');
              res.redirect('/dashboard');
            }
            else {
              // If there's no slot booked by this 'student' that 'alumnus' did not confirm.
              Slot.allPendingSlots(function(err, docs){
                if(!err){
                  var flag = 0;
                  for(var i = 0; i < docs.length; i++){
                    if((docs[i].date == date) && (docs[i].slot == slot) && (docs[i].alumni == alumni)){
                      flag = 1;
                      //console.log('Here: allpendingSlots', docs);
                    }
                  }
                  if(!flag){
                    var newSlot = new Slot({
                      date: date,
                      slot: slot,
                      alumni: alumni,
                      student: student
                    });

                    //console.log('Slot: ' + JSON.stringify(newSlot));

                    newSlot.save(function(err){
                      if(!err){
                        User.findByIdAndUpdate(req.user._id, { slots_booked: slots_booked }, function(err, docs){
                          if(err){
                            console.log('Update User booking: Error: ' + JSON.stringify(err));
                          }
                        });
                        console.log('Slot saved successfully');
                        res.redirect('/dashboard');
                      }
                      else {
                        console.log('Error saving slot'+ JSON.stringify(err));
                      }
                    });
                  }
                  else {
                    req.flash('error_msg', 'This slot is already taken. Try another.');
                    res.redirect('/dashboard');
                  }

                }
                else{
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
        req.flash('error_msg', 'You can only book a slot at most week in advance.');
        res.redirect('/dashboard');
      }
    }

    else {
      req.flash('error_msg', 'You have booked maximum number of slots.');
      res.redirect('/dashboard');
    }
  }
  else {
    req.flash('error_msg', 'You are not authorized to do this.');
    res.redirect('/');
  }
});

router.post('/reject', ensureAuthenticated, function(req, res){
  if(req.user.permission == 'alumni'){
    var id = req.body.id;
    Slot.findByIdAndUpdate(id, { status: 'rejected', al_act: true }, function(err, docs){
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


router.post('/confirm', ensureAuthenticated, function(req, res){
  if(req.user.permission == 'alumni'){
    var id = req.body.id;
    Slot.findByIdAndUpdate(id, { status: 'confirmed', al_act: true }, function(err, docs){
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
