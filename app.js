var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express(),
	http = require("http").createServer(app),
	io = require("socket.io").listen(http);

require('./config/express')(app, config, io);
//require('./config/socket')(app, config);

http.listen(app.listen(config.port));

//app.listen(config.port);

