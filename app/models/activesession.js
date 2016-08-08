var db = require('mongoose'),
  Schema = db.Schema; 

var activeSessionSchema = new Schema({
	username  : { type: String,  required: true },
	sessionid : { type: String, required: true },
	fullname	: { type: String, required: true },
	loggeddate	: {	type : Date, default: Date.now },
	isactive : {type : Boolean , default: false} 
});

module.exports = db.model('ActiveSession', activeSessionSchema);