var User = require('../models/user')
var Exercise = require('../models/exercise')
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

    // TODO: validate/sanitize.
    
    
    if (req.query.userId){

	// Check if user id is in database.
	User.findOne({'_id': req.query.userId}) // change to findById?
	    .exec( function (err, user_info) {
		if (err) {
		    return next(err);
		}

		// No error. Check if found user info.
		if (user_info){

		    // Use this user's user id to
		    // find all their workout logs
		    // sorted by date.
		    Exercise.find({'userId': user_info._id })
		        .sort('-date') 
			.exec(function (err, exercise_workouts) {
			    if (err) {return next(err);}

			    // No error. So copy user info
			    // to return json response that shows
			    // this user plus their workout log.
			    
			    console.log(user_info);
			    console.log('count is: ', exercise_workouts.length);
			    console.log(exercise_workouts[1].date >= Date.now());
			    console.log(exercise_workouts);
			    res.json({'result': exercise_workouts});

			});

		    
		} else {
		    res.json({'error': 'User Id not found in database.'});
		}
	    });


    } else {
	res.json({'error': 'Must supply userId.'});	
    }
};

// Display array of all users.
exports.user_list = function (req, res, next) {
    // Find all users...
    User.find()
	.exec( function(err, allUsers){
	    if (err) return next(err);

	    // No errors, so display array
	    // of all users.
	    res.json(allUsers);
	});


};

