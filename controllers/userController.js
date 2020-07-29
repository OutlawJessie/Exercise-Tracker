var User = require('../models/user')
var async = require('async')


// Create a new user.
// Input stored in req.body will be {new_user: 'something typed into form'}
exports.post_user = function(req, res, next){

    // TODO: validate/sanitize data.

    
    // Create new user object.
    var userObj = new User(
	{user_name: req.body.new_user}
    );

    // Check if username exists in db ....
    User.findOne({ 'user_name': req.body.new_user })
        .exec( function(err, found_user) {
            if (err) { return next(err); }
            if (found_user) {
		// User exists. Display that user exists.
		res.send('Username is already taken.');
	    }
            else {
		userObj.save(function (err) {
		    if (err) { return next(err); }
		    // User object saved. Display new user and id field.
		    res.json({"username": userObj.user_name, "_id": userObj._id.toString() } );
		});
	    }
	});
    
};

// Display information for single user.
exports.get_single_user = function (req, res, next) {
    if (req.query.userId){
	res.json({'result': 'single user working'});
	console.log(req.query.userId);
    } else {
	res.json({'result': 'not working'});	
    }
};

// Display list of all users.
exports.user_list = function (req, res, next) {
    res.json({'users':'will show all users.'});
};

