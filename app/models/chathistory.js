var db = require('mongoose'),
  Schema = db.Schema; 

var chatHistorySchema = new Schema({
	senderid  : { type: String,  required: true },
	receiverid : { type: String, required: true },
	msg	: { type: String, required: true },
	loggeddate	: {	type : Date, default: Date.now }
});

module.exports = db.model('ChatHistory', chatHistorySchema);