var Exercise = require('../models/exercise')
var User = require('../models/user')
var async = require('async')

// Create a new exercise for an existing user.
exports.post_exercise = function(req, res, next) {

    //console.log(req.body.date);
    // req.body.date === '' will be false below since it is undefined in some cases.
    
    User.findById(req.body.userId, (err, user) => {
	if (err){return next(err);}

	// Say if user does not exist.
	if (!user) {
	    res.send('User ID does not exist');
	} else {
	    
	    // User does exist, so make a new exercise
	    // object representing their workout.
	    var exerciseObj = new Exercise({
		userId: req.body.userId,
		description: req.body.description,
		duration: req.body.duration,
		date: (req.body.date === '' || req.body.date === undefined) ? (Date.now()) : (req.body.date)
	    });

	    // Save the new exercise workout info to database.
	    exerciseObj.save(function (err) {
		if (err) return next(err);

		// Saved without errors.

		// FCC User Requirement says: "App will return the user object with the exercise fields added."
		// So deep copy user, add exercise fields, and give json response on that.
		let fccRequirement = JSON.parse(JSON.stringify(user));
		fccRequirement['description'] = exerciseObj['description'];
		fccRequirement['duration'] = exerciseObj['duration'];
		fccRequirement['date'] = (new Date(exerciseObj['date'])).toDateString(); // Free Code Camp Tests demand this format (example: Wed Jul 29 2020)
		delete fccRequirement['__v']; // FCC examples don't show the version key, and tests will not pass without deletion.
		res.json(fccRequirement);

		
	    });
	}
    });
		  
    
};

