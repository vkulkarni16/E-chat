var db = require('mongoose'),
  Schema = db.Schema;
var passportLocalMongoose = require('passport-local-mongoose');  

var userSchema = new Schema({
	fullname   : { type: String, required: true },
	username  : { type: String,  required: true, unique : true },
	password : { type: String},
	email	: { type: String, unique : true, required: true },
	dob	: {	type: Date, required: true },
	gender : { type: String},
	profilepic : { type: String},
	oauth : [],
	contactlists: [String],
	pendinglists: [String],
	rejectedlists: [String],
	lastloggedin	: {	type: Date, default: Date.now  },
	lastloggedout	: {	type: Date, default: Date.now  }
});

userSchema.plugin(passportLocalMongoose);

module.exports = db.model('User', userSchema);