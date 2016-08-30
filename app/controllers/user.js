var express = require('express');
var router = express.Router();
var passport = require('passport');
var templateSignup = require('marko').load(require.resolve('./../views/signup.marko'));
var template = require('marko').load(require.resolve('./../views/chat.marko'));
var index = require('marko').load(require.resolve('./../views/index.marko'));
var mongoose = require('mongoose'),
    User = mongoose.model('User');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (app) {
	app.use('/', router);
};

router.get('/', function (req, res) {
    res.redirect('/signup');
});

router.get('/index', function (req, res) {
    index.render({}, res);
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
  User.find({ _id : req.user._id }, 
    { contactlists: true, pendinglists : true, _id: false } , (err, users) => {
    	if(!err)
    		getUsersList(users[0].contactlists, function(err, contactlists){
    		if(!err)
    			getUsersList(users[0].pendinglists, function(err, pendinglists){
    				template.render({ user : req.user , 
    					contactlists : contactlists, 
    					pendinglists : pendinglists }, res);
    			})
    		else
    			template.render({ user : req.user , error: err }, res);
    		})
    	else
    		template.render({ user : req.user , error: err }, res);
  	})
})

function getUsersList(lists, next){
	User.find({ _id : { "$in" : lists } }, function (err, userLists ) {
		next(err, userLists);
    })
}

router.post('/register',(req, res) => {
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
	User.find({ _id : req.user._id }, { contactlists: true, _id: false } , (err, users) => {
    	if(!err){
    		var contactlists = users[0].contactlists;
    			contactlists.push(req.user._id);
    		User.find({ 
    			_id : { $nin : contactlists }, 
    			fullname : { $regex : new RegExp(value+'*.', "i") }
    		  },{ username: true, fullname: true, _id: true }, function(err, searchlists ) {
	        	if(!err)
	          		res.json({
					status : "success",
					data : searchlists
				})
	        	else
		          	res.json({
					error : err
				});
      		})
    	}else
      		res.json({
				error : err
			});
  	});

});

router.post('/addContact', (req, res) =>  {
	var newUserId = req.body.newUserId;
	User.findOne({ _id : newUserId }, (err, user) => {
		if(err)
			template.render({ user : req.user , error: err }, res)
		else if( user == null )
			template.render({ user : req.user , msg: " User not found. Please resend the request" }, res);
		else {
			// Check contact allready exists in pendinglists
			if(isContactExists(user.pendinglists, req.user._id) == -1 ){
				// Add contact in pendinglists 
				user.pendinglists.push(req.user._id);
				// Update the user
				user.save((err, data) => {
					if(!err)
						res.redirect('/webchat');
					else
						template.render({ user : req.user , error: err }, res);
				})
			}else
				template.render({ user : req.user , msg: " Request allready sent.. waiting for approval" }, res);
		}
	})
});

router.post('/approveContact', (req, res) =>  {
	var newUserId = req.body.newUserId;
	User.findOne({ _id : req.user._id }, (err, user) => {
		if(err)
			template.render({ user : req.user , error: err }, res);
		else if( user == null )
			template.render({ user : req.user , error: "User not found" }, res);
		else {
			// Check user allready exists in contactlists
			if(isContactExists(user.contactlists, newUserId) == -1)			
				user.contactlists.push(newUserId);

			// Check user allready exists in pendinglists
			var arrayIndex = isContactExists(user.pendinglists, newUserId );
	      	if(arrayIndex != -1){
	      		//Remove user from pendinglist
	        	user.pendinglists.splice(arrayIndex, 1);
	        	//update the user		
				user.save((err, data) => {
					if(!err){

						updateContactList(req, newUserId);
						res.redirect('/webchat');
					}else
						template.render({ user : req.user , error: err }, res);
					})
				} else
					template.render({ user : req.user , error: err }, res);
		}	
	})
});

router.get('/getContacts', (req, res) =>  {
	User.find({ _id : req.user._id }, 
			{ _id: true, fullname: true } , (err, data) => {
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

function updateProfilepicpath(req){
	User.update({ _id: req.user._id },{ $set : { isProfilepicpath : true } }, function(err, data){
		if(!err)
			console.log("Profilepicpath updated");
	})

}

function updateContactList(req, newUserId){
	User.findOne({ _id : newUserId}, function( err, user){
		if(!err){
			if(isContactExists(user.contactlists, req.user._id) == -1){
				user.contactlists.push(req.user._id);
				user.save( function( err, data){
					if(!err)
						console.log(" Approved");
					else
						console.log(" Error : " + err);
				})
			}else {
				console.log("Contact allready exists ");
			}	
		}	
	})
}

function isContactExists(array, id){
	return array.indexOf(id);
}

router.post('/uploadProfilePic', multipartMiddleware, (req, res) => {
	fs.readFile(req.files.image.path, function (err, data) {
	    if(!req.files.image.name)
	      	res.json({
	        	error : " Not a image"
	        })
	    else {
	      	var path  = __dirname.split('/');
		  		path.pop(); 
		  		path.pop();
	      	var newPath = path.join('/') + "/public/img/profiles/" + req.user._id  + ".png";	
	      	fs.writeFile(newPath, data, function (err) {
		  		if(!err){
		  			console.log("File Saved");
		  			updateProfilepicpath(req);
		  			res.json({
		  				id: req.user._id,
		  				status: "success"
		  			})		
		  		}else{
		  			console.log("Profile pic upload error: "+ err);
		  			res.json({
		  				error: err
		  			})
		  		}	
	        })
	    }
  	})
});




