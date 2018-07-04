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
  confirmed: {
    type: Boolean,
    default: false
  }
});

var Slot = module.exports = mongoose.model('Slot', SlotSchema);

module.exports.getAlumniSlots = function(id, callback){
  var query = {alumni: id};
  console.log(query);
  Slot.find(query, callback);
}

module.exports.getUserSlots = function(username, callback){
  var query = {student: username};
  Slot.find(query, callback);
}
