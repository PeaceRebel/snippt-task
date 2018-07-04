var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/snippt-scheduler');
var db = mongoose.connection;
