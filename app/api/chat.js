var mongoose = require('mongoose'),
    ChatHistory = mongoose.model('ChatHistory');

function recordChat(data, next){
  var chat = {
    senderid : data.senderid,
    receiverid : data.participant.participantid,
    msg : data.message
  }
  chathistory = new ChatHistory(chat);
  chathistory.save(function( err, data){
    if(!err)
      next(err, data);
    else
      next(err, data); 
  });
}

function getChatHistory(req, res, next){
    var query = ChatHistory.find({ senderid : { $in : [ req.user._id, req.query.receiverid ] }, 
                receiverid : { $in : [ req.query.receiverid, req.user._id ] } } )
                .sort({'loggeddate': -1})
                .limit(10);

    query.exec((err, data) => {
      if(!err)
        next(err, data);
      else
        next(err, data);
    })
}

module.exports = {
  recordChat : recordChat,
  getChatHistory : getChatHistory
}