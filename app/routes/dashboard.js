var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Slot = require('../models/slot');

router.get('/', ensureAuthenticated, function(req, res){
  if(req.user.permission == "alumni"){
    Slot.getAlumniSlots(req.user.username, function(err, docs){
      if(!err){
        res.render('pages/dashboard/alumni', { slots: docs});
      }
      else {
        console.log('Error finding slots: ' + JSON.stringify(err, undefined, 2))
      }
    });
  }
  else{
    Slot.getUserSlots(req.user.username, function(err, docs){
      if(!err){
        var Slots = docs;
        User.getAlumni(function(err, docs){
          if(!err){
            res.render('pages/dashboard/student', {alumni: docs, slots: Slots });
          }
          else {
            console.log("getAlumni: Error: " + JSON.stringify(err));
          }
        });
      }
      else{
        console.log("Find Slot: Error: " + JSON.stringify(err));
      }
    });
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
