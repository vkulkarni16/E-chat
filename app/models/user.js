var db = require('mongoose'),
  Schema = db.Schema;
  ObjectId = Schema.ObjectId;
var passportLocalMongoose = require('passport-local-mongoose');  

var userSchema = new Schema({
	fullname   : { type: String, required: true },
	username  : { type: String,  required: true, unique : true },
	password : { type: String },
	email	: { type: String, unique : true, required: true },
	dob	: {	type: Date, required: true },
	gender : { type: String},
	isProfilepicpath : { type: Boolean, default: false },
	oauth : [],
	contactlists: [ObjectId],
	pendinglists: [ObjectId],
	rejectedlists: [ObjectId],
	lastloggedin	: {	type: Date, default: Date.now  },
	lastloggedout	: {	type: Date, default: Date.now  }
});

userSchema.plugin(passportLocalMongoose);

module.exports = db.model('User', userSchema);