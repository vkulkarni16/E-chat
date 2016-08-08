var express = require('express');
var router = express.Router();
var passport = require('passport');
var templateSignup = require('marko').load(require.resolve('./../views/signup.marko'));
var template = require('marko').load(require.resolve('./../views/chat.marko'));
var test = require('marko').load(require.resolve('./../views/test.marko'));
var mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = function (app) {
	app.use('/', router);
};

router.get('/', function (req, res) {
    res.redirect('/signup');
});

router.get('/test', function (req, res) {
    test.render({}, res);
});

router.get('/signup', function(req, res) {
    templateSignup.render({}, res);
});

router.get('/login', function(req, res) {
    res.redirect('/signup');
});

router.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/webchat');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/signup');
});

router.get('/webchat', isLoggedIn ,function (req, res, next) {
  User.find({ username : req.user.username }, 
    { contactlists: true, _id: false } , (err, users) => {
    if(!err)
      User.find({ username : { "$in" : users[0].contactlists } }, (err, contactlists ) => {
        if(!err)
          template.render({ user : req.user , contactlists : contactlists }, res);
        else
          template.render({ user : req.user , error: err }, res);
      })
    else
      template.render({ user : req.user , error: err }, res);
  });
});

router.post('/register', (req, res) => {
	var user_data = {
		fullname   : req.body.fullname,
		username  : req.body.username,
		email	: req.body.email,
		dob	: new Date(req.body.dob)
	};

	User.register(new User(user_data), req.body.password, (err, data) => {
		if(err){
			templateSignup.render({ error: err , user : data}, res);
		}	
		passport.authenticate('local')(req, res, function () {
            res.redirect('/webchat');
        })
	});
});
   
router.get('/searchContacts', (req, res) =>  {
	var value = req.query.srcInput;
	console.log("value"+ value);
	User.find({ fullname : { $regex : new RegExp(value+'*.', "i") } }, 
			{ username: true, fullname: true, _id: false } , (err, data) => {
		if(!err){
			res.json({
				status : "success",
				data : data
			})	
		}
		else
			res.json({
				error : err
			});
	});
});

router.post('/addContact', (req, res) =>  {
	var newUserName = req.body.newUserName;
	User.findOne({ username : req.user.username }, (err, user) => {
		if(err)
			res.json({ error : err });
		else if( user == null )
			res.json({ msg : "user not found " });
		else {
			user.contactlists.push(newUserName);
			user.save((err, data) => {
				if(!err)
					res.json({
 						status : "success",
						data : data
 					});
				else
					res.json({
 						error: err
 					});
			})
		}
	})
});

router.get('/getContacts', (req, res) =>  {
	User.find({ username : req.user.username }, 
			{ username: true, fullname: true, _id: false } , (err, data) => {
		if(!err){
			res.json({
				status : "success",
				data : data
			})	
		}
		else
			res.json({
				error : err
			});
	});
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/signup');
}

