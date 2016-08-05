var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'e-chat'
    },
    port: 3000,
    db: 'mongodb://localhost/e-chat-development'
    
  },

  test: {
    root: rootPath,
    app: {
      name: 'e-chat'
    },
    port: 3000,
    db: 'mongodb://localhost/e-chat-test'
    
  },

  production: {
    root: rootPath,
    app: {
      name: 'e-chat'
    },
    port: 3000,
    db: 'mongodb://localhost/e-chat-production'
    
  }
};

module.exports = config[env];
