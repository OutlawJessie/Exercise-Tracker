var User = require('../models/user')
var Exercise = require('../models/exercise')
var async = require('async')

// Create a new user.
// Input stored in req.body will be {new_user: 'something typed into form'}
exports.post_user = function(req, res, next){

    // TODO: validate/sanitize data.

    // Define a new user from the request.
    // If someone manually fills out the form, this will be req.body.username,
    // but Free code camp sends automated post requests as 'username'.
    let new_user = (typeof req.body.username !== 'undefined' && req.body.username)
	? (req.body.username) : (req.body.new_user);

    //console.log(req);
    // Create new user object.
    var userObj = new User(
	{username: new_user}
    );

    // Check if username exists in db ....
    User.findOne({ 'username': new_user })
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
		    res.json({"username": userObj.username, "_id": userObj._id.toString() } );
		});
	    }
	});
    
};

/*
This function checks if a Date object is valid:
https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
*/
Date.prototype.isValid = function () {
    // An invalid date object returns NaN for getTime() and NaN is the only
    // object not strictly equal to itself.
    return this.getTime() === this.getTime();
}; 


/*

This function creates a customized workout log from a user object, an array
of workout objects, a start Date() object, and end Date() object, and an 
integer limit for the number of workouts to include in the log.

Inputs: user     -- user object.
        workouts -- array of workout objects.
        start    -- JavaScript Date object representing start of workout log to filter.
        end      -- JavaScript Date object representing end of workout log to filter.
        limit    -- integer number of workout log entries to show in return.


Example Output:
{
  _id: 5g23251096b6f79c66ef241e,
  username: 'Some User Name',
  count: 2,
  log: [
    {
      description: 'kettle bells',
      duration: 2,
      date: Mon Jan 09 2010
    },
    {
      description: 'treadmill run',
      duration: 20,
      date: Sat Dec 04 2020
    }
  ]
}


*/
const makeWorkoutLog = (user, workouts, start, end, limit) => {

    // Create log info and extract user information.
    let logInfo = {};
    logInfo['_id'] = user._id;
    logInfo['username'] = user.username;
    
    // Filter workouts by start, end, and limit and
    // only show description, duration, and date for each workout.
    logInfo['count'] = 0; // number of workout logs in logInfo
    logInfo['log'] = workouts.filter(  (obj, i) => {
	
	// Make a Date object out of current object date property.
	let currObjDate = new Date(obj.date);

	// If count is less than defined limit and date of current
	// object is inside bounds.	
	if (
	    ( (!limit) ||  (logInfo['count'] < limit) ) // within limits
		&& ( (start <= currObjDate ) ) // within lower date bound
		&& ( (currObjDate <= end ) ) // within upper date bound
	   ){
		// Update the count and return true so
		// this object gets added to array.
		logInfo['count'] = logInfo['count'] + 1;
		return true; // true adds to array with js filter
	    } else {
		return false;
	    }
    }).map( (obj, i) => { // only keep description, duration, and date keys
	return {'description': obj.description, 'duration': obj.duration, 'date': (new Date (obj.date)).toDateString()}; // FCC requires special date string format!	    
	});

    
    // Return log information.
    return logInfo;
};

// Display information for single user.
exports.get_single_user = function (req, res, next) {

    // TODO: validate/sanitize.

    // Date validation.
    if (!req.query.from){
	var startDate = new Date(-8640000000000000);	
    } else {
	var startDate = new Date(req.query.from);
	if (!startDate.isValid() ){
	    return res.status(400).json({status: 'error', message: 'invalid start date.'});
	}
    }
    if(!req.query.to){
	var endDate = new Date(8640000000000000);
    } else{
	var endDate = new Date(req.query.to);
	if (!endDate.isValid()){
	    return res.status(400).json({status: 'error', message: 'invalid end date.'});
	}
    }    
    
    // Check if username is there...
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
			    // No error.
			    // Copy user info to return json response that shows this user plus their workout log
			    // with helper function.
			    let userWorkoutLog = makeWorkoutLog(user_info, exercise_workouts, startDate, endDate, req.query.limit);
			    
			    //res.json({'result': exercise_workouts});
			    res.json(userWorkoutLog);

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

