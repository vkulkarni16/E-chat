var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  template = require('marko').load(require.resolve('./../views/chat.marko'));
  //_ = require("underscore");
  
module.exports = function (app, io) {
  app.use('/webchat', router);
  var participants = [];

  io.on("connection", function(socket){

    socket.on("new user", function(data) {

      var arrayIndex = participants.map(function(participant){
        return participant.username; }).indexOf(data.username);

      arrayIndex == -1 ? 
        participants.push({ id: data.id, username: data.username, name: data.name  }) :
        participants[arrayIndex].id = data.id ;

      io.sockets.emit("new connection", { participants: participants });

    });

    socket.on("send message", function(data) {
      io.sockets.emit("new message", { message: data.message, name: data.name });
    });

    socket.on("disconnect", function() {
      var arrayIndex = participants.map(function(participant){
        return participant.id; }).indexOf(socket.id);
      //remove disconnected user
      participants.splice(arrayIndex,1);

      io.sockets.emit("user disconnected", { id: socket.id.slice(2), sender: "system" });
    });

  });

};

router.get('/', isLoggedIn ,function (req, res, next) {
  template.render({ user : req.user }, res);
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/signup');
}



