var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');
  chatapi = require('./../api/chat');
  var participants = [];
  
module.exports = function (app, io, passport) {
  app.use('/chat', router);



  io.on("connection", function(socket){

    socket.on("new user", function(data) {
      var newUser = {};
        newUser['sessionid'] = socket.id;
        newUser['id'] = data.id;
        newUser['fullname'] = data.name;

       var arrayIndex = participants.map(function(participant){
        return participant.id; }).indexOf(data.id);

      if(arrayIndex == -1){
        participants.push(newUser);
        console.log("new user pushed: "+newUser.id) 
      } else {
        participants[arrayIndex].sessionid = socket.id;
        console.log("new user updated "+participants[arrayIndex].id) 
      }
      console.log("participants length:"+participants.length);

      io.sockets.emit("new connection", { participants: participants }); 

      // activateSession(newUser, function( err, data) {
      //   if(!err)
      //     getActiveContacts(function(err, data){
      //       if(!err){
      //         console.log(" get ActiveSessions :"+ data);
      //         io.sockets.emit("new connection", { participants: data });
      //       } else {
      //         console.log(" Get active sessions :"+ err);
      //       } 
      //     })
      //   else{
      //     console.log(" ActivateSession :"+ err);
      //   }
      // });

    });
    socket.on("send request", function(data){
      var arrayIndex = participants.map(function(participant){
        return participant.id; }).indexOf(data.nrid);
      if(arrayIndex != -1)
        socket.broadcast.to(participants[arrayIndex].sessionid).emit("new request", { ncid : data.senderid });

    })
    socket.on("approve request", function(data){
      var arrayIndex = participants.map(function(participant){
        return participant.id; }).indexOf(data.nrid);
      if(arrayIndex != -1)
        socket.broadcast.to(participants[arrayIndex].sessionid).emit("new contact", { ncid : data.senderid });

    })

    socket.on("send message", function(msg) {
      chatapi.recordChat(msg, function(err, data){
        if(!err){
          var arrayIndex = participants.map(function(participant){
        return participant.id; }).indexOf(msg.participant.participantid);

        if(arrayIndex != -1){  
            socket.broadcast.to(participants[arrayIndex].sessionid).emit("new message", { recieverid: msg.senderid, 
                   msg: msg.message, name: msg.name });
          }           
          //   getClientSocketID( msg.participant.participantid , function( err, data){
          //     if(!err)
          //       socket.broadcast.to(data[0].sessionid).emit("new message", { recieverid: msg.senderid, 
          //         msg: msg.message, name: msg.name });
          //     else
          //       console.log(" Get client socket error :" +  err);     
          // });
        }else
          console.log(" Send Message Error :" + err);   
      });
    });

    socket.on("disconnect", function() {
      var arrayIndex = participants.map(function(participant){
        return participant.sessionid; }).indexOf(socket.id);
      //remove disconnected user
      if(arrayIndex != -1){
        var id = participants[arrayIndex].id;
        participants.splice(arrayIndex,1);
        io.sockets.emit("user disconnected", { id: id, sender: "system" });
      }
      // inactiveSession(socket.id, function(err, data){
      //   if(!err){
      //     console.log("disconnected username: "+data);
      //     io.sockets.emit("user disconnected", { username: data.username, sender: "system" });
      //   }else
      //     console.log("User disconnected error: " + err);
      // });
    });

  });

};

router.get('/', function (req, res) {
  if(req.user)
    chatapi.getChatHistory(req, res, (err, data) => {
      if(!err)
        res.json({
          status : "success",
          data : data
        })  
      else
        res.json({
          error : err
        })
    })
  else 
    res.redirect('/signup');
})

function onAuthorizeSuccess(data, accept){
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept){
  accept(null, true);
}








