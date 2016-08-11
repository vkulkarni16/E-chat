var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');
  chatapi = require('./../api/chat');
  var participants = [];
  
module.exports = function (app, io) {
  app.use('/chat', router);

  io.on("connection", function(socket){

    socket.on("new user", function(data) {
      var newUser = {};
        newUser['sessionid'] = socket.id;
        newUser['username'] = data.username;
        newUser['fullname'] = data.name;

       var arrayIndex = participants.map(function(participant){
        return participant.username; }).indexOf(data.username);

      if(arrayIndex == -1){
        participants.push(newUser);
        console.log("new user pushed: "+newUser.username) 
      } else {
        participants[arrayIndex].sessionid = socket.id;
        console.log("new user updated "+participants[arrayIndex].username) 
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

    socket.on("send message", function(msg) {
      chatapi.recordChat(msg, function(err, data){
        if(!err){
          var arrayIndex = participants.map(function(participant){
        return participant.username; }).indexOf(msg.participant.participantid);

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
        var username = participants[arrayIndex].username;
        participants.splice(arrayIndex,1);
        io.sockets.emit("user disconnected", { username: username, sender: "system" });
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









