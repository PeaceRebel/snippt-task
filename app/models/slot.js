var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var SlotSchema = mongoose.Schema({
  slot:{
    type:String,
    enum: ['13:00-14:00', '16:00-17:00', '18:00-19:00']
  },
  date: {
    type: String
  },
  alumni:{
    type: String,
  },
  student:{
    type: String
  },
  status: {
    type: String,
    enum: ['unconfirmed', 'confirmed', 'rejected'],
    default: 'unconfirmed'
  },
  al_act: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: String,
  }
});

var Slot = module.exports = mongoose.model('Slot', SlotSchema);

// Get all slots booked to an alumnus.
module.exports.getAlumniSlots = function(id, callback){
  var query = {alumni: id};
  Slot.find(query, callback);
}

// Get all slots booked by a student.
module.exports.getUserSlots = function(username, callback){
  var query = {student: username};
  Slot.find(query, callback);
}

// Get all slots, that are still pending, booked by a student.
module.exports.pendingSlots = function(username, callback){
  var query = {student: username, status: 'unconfirmed'};
  Slot.find(query, callback);
}

module.exports.allPendingSlots = function(callback){
  var query = { status: {"$in": ['unconfirmed', 'confirmed']}};
  Slot.find(query, callback);
}
