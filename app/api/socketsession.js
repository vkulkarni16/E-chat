var mongoose = require('mongoose'),
  ActiveSession = mongoose.model('ActiveSession');

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

	function getClientSocketID(username, next) {
	  ActiveSession.find({ username: username},{ _id : false, sessionid: true }, function(err, data) {
	    if(!err)
	      next(err, data);
	    else
	      next(err, data);  
	  })
	}

	function removeSession(session){
	  console.log("remove session");
	  ActiveSession.remove({ sessionid : sessionid } , function(err, data){
	    if(err){
	      console.log("remove err: "+err);
	      return err;}
	    else{
	      console.log("remove data:"+data);
	      return 'success';}
	  })
	}
	
module.exports = {
  getClientSocketID: getClientSocketID
}	