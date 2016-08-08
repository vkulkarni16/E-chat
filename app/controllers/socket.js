var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  ActiveSession = mongoose.model('ActiveSession'),
  User = mongoose.model('User');
  ChatHistory = mongoose.model('ChatHistory');
  
module.exports = function (app, io) {
  app.use('/chat', router);

  io.on("connection", function(socket){

    socket.on("new user", function(data) {
      var newUser = {};
        newUser['sessionid'] = socket.id;
        newUser['username'] = data.username;
        newUser['fullname'] = data.name;
      activateSession(newUser, function( err, data) {
        if(!err)
          getActiveContacts(function(err, data){
            if(!err){
              console.log(" get ActiveSessions :"+ data);
              io.sockets.emit("new connection", { participants: data });
            } else {
              console.log(" Get active sessions :"+ err);
            } 
          })
        else{
          console.log(" ActivateSession :"+ err);
        }
      });

    });

    socket.on("send message", function(msg) {
      recordChat(msg, function(err, data){
        if(!err)
            getClientSocketID( msg.participant.participantID , function( err, data){
              if(!err)
                socket.broadcast.to(data[0].sessionid).emit("new message", { recieverID: msg.senderID, 
                  message: data.message, name: data.name });
              else
                console.log(" Get client socket error :" +  err);     
          });
        else
          console.log(" Send Message Error :" + err);   
      });
    });

    socket.on("disconnect", function() {
      inactiveSession(socket.id, function(err, data){
        if(!err){
          console.log("disconnected username: "+data);
          io.sockets.emit("user disconnected", { username: data.username, sender: "system" });
        }else
          console.log("User disconnected error: " + err);
      });
    });

  });

};

router.get('/', function (req, res) {
  var query = ChatHistory.find({ senderid : { $in : [ req.user.username, req.query.receiverid ] }, 
              receiverid : { $in : [ req.query.receiverid, req.user.username ] } } )
              .sort({'loggeddate': -1})
              .limit(10);

  query.exec((err, data) => {
    if(!err){
      res.json({
        status : "success",
        data : data
      })  
    }
    else
      res.json({
        error : err
      })
  })
})

function activateSession(session, next){
  ActiveSession.findOne( { username: session.username }, function(err, data){
    if(err)
      next(err, data);
    else if( data == null){
      var activeSession = new ActiveSession(session);
      activeSession.save((err, data) => {
        if(err)
          next(err, data);
        else
          next(err, data);
      })
    } else {
      ActiveSession.update({ username: session.username }, { $set:{ sessionid: session.sessionid, loggeddate: Date.now(), isactive: true } }, (err, data) => {
        if(err)
          next(err, data);
        else
          next(err, data);
      });
    }    
  })
} 

function inactiveSession(sessionid, next){
  ActiveSession.findOne({ sessionid: sessionid }, function(err, dataOne){
    if(err)
      next(err, dataOne);
    else
      ActiveSession.update({sessionid: sessionid},{ $set:{ isactive: false, loggeddate: Date.now()}}, function(err,data){
        if(err)
          next(err, data);
        else
          next(err, dataOne);
      })
  })
}

function getActiveContacts(next){
  ActiveSession.find({ isactive: true }, { username: true, fullname: true, _id: false } , function(err, data){
    if(!err)
      next(err, data);
    else
      next(err, data);
  })
}

function recordChat(data, next){
  var chat = {
    senderid: data.senderID,
    receiverid: data.participant.participantID,
    msg: data.message
  }
  chathistory = new ChatHistory(chat);
  chathistory.save(function( err, data){
    if(!err)
      next(err, data);
    else
      next(err, data); 
  });
}

function getClientSocketID(username, next) {
  ActiveSession.find({ username: username},{ _id : false, sessionid: true }, function(err, data) {
    if(!err)
      next(err, data);
    else
      next(err, data);  
  })
}

// function removeSession(session){
//   console.log("remove session");
//   ActiveSession.remove({ sessionid : sessionid } , function(err, data){
//     if(err){
//       console.log("remove err: "+err);
//       return err;}
//     else{
//       console.log("remove data:"+data);
//       return 'success';}
//   })
// }





