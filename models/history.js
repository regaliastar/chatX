var mongoose = require('mongoose');

var hisySchema = mongoose.Schema({
	user:String,
	avator:String,
	msg:String,
	date:Date,
	available:Boolean
});

var History = mongoose.model('History',hisySchema);
module.exports = History;