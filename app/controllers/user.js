var express = require('express');
var router = express.Router();
var passport = require('passport');
var templateSignup = require('marko').load(require.resolve('./../views/signup.marko'));
var mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = function (app) {
	app.use('/', router);
};

router.get('/', function (req, res) {
    res.redirect('/signup');
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

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
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
            res.redirect('/signup');
        })
	});
});
   
router.get('/userlist', (req, res) =>  {
	User.find({},{} , (err, data) => {
		if(!err)
			res.json(data);
		else
			res.json({
				error : err
			});
	});
});

// router.post('/addreview', (req, res) => {
// 	var review_data = {
// 		name	: req.body.review_name,
// 	  	review  : req.body.review_dsc,
// 	 	rate    : req.body.review_rating
// 	};
// 	var id = req.body._id;

// 	Book.findOne({ _id: id }, (err, book) => {
// 		if(err)
// 			res.json({
// 				error :  err
// 			});
// 		else if(book == null)
// 				res.json({
// 					msg : "Document not found"
// 				});
// 		else{
// 			book.reviews.push(review_data);
// 			var rating = 0;
// 			for(var i = 0; i < book.reviews.length; i++){
// 				rating += book.reviews[i].rate;
// 			}

// 			Book.update({_id: book._id},{ $set :{ average_rate : ((rating/book.reviews.length).toFixed(2))*100 }}, (err, data) => {
// 				if(!err)
// 					console.log("Rating Updated")
// 				else
// 					console.log(err);
// 			});

// 			book.save((err, data) => {
// 				if(!err){
// 					res.json({
// 						status : "success",
// 						data : data
// 					});
// 				}	
// 				else
// 					res.json({
// 					error: err
// 				});
// 			});
// 		}	
// 	});		

// });


// router.put('/updatebook/:id', (req, res) => {
// 	var book_data = {
// 		title   : req.body.book_title,
// 		author  : req.body.book_author,
// 		isbn	: req.body.book_isbn,
// 		price	: (parseFloat(req.body.book_price)).toFixed(2) * 100
// 		//average_rate	: req.body.book_rating
// 	};
// 	var id = req.params.id;

// 	Book.update({ _id: id }, { $set : book_data }, (err, data) => {
// 		if(!err)
// 			res.json({
// 				status : "success",
// 				data : data
// 			});
// 		else
// 			res.json({
// 				error: err
// 			});
// 	});
// });

// router.delete('/deletebook/:id', (req, res) => {
// 	var id = req.params.id;
// 	Book.findOne({ _id: id }, (err, data) => {
// 		if(err)
// 			res.json({
// 				error :  err
// 			});
// 		else if(data == null)
// 			res.json({
// 				msg : "Document not found"
// 			});
// 		else
// 			Book.remove({ _id: id }, (err, data) => {
// 				if(err)
// 					res.json({
// 						error : err
// 					})
// 				else
// 					res.json({
// 						status : "success",
// 						msg : "document deleted successfully"
// 					});
// 		});

// 	});
// });
	