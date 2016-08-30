var db = require('mongoose'),
  Schema = db.Schema;
  ObjectId = Schema.ObjectId; 

var chatHistorySchema = new Schema({
	senderid  : { type: ObjectId,  required: true },
	receiverid : { type: ObjectId, required: true },
	msg	: { type: String, required: true },
	unread	: { type: Boolean, default: false },
	loggeddate	: {	type : Date, default: Date.now }
});

module.exports = db.model('ChatHistory', chatHistorySchema);