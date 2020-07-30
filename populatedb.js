/*
This script populates the mongodb database with some url entries and indices.
It is adapted from: https://github.com/mdn/express-locallibrary-tutorial/blob/master/populatedb.js
*/

// Load async package and models.
var async = require('async');
var User = require('./models/user');
var Exercise = require('./models/exercise');

// Load uri key.
require('dotenv').config()
var uri =  process.env.MONGODB_URI;

// Connect with mongoose.
var mongoose = require('mongoose');
mongoose.connect(uri, { useNewUrlParser: true,
		      useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Initialize arrays.
var users = [];
var exercises = [];

/*
Function for creating user.


  Arguments: userName  -- name of user
             cb        -- callback function 
*/
function userCreate(userName, cb) {

    // Create new user mongodb document.
    var newUser = new User( { user_name: userName} );

    // Try to save it, or return an error.
    newUser.save(function (err) {
	if (err) {
	    cb(err, null)
	    return
	}
	
	console.log('New User: ' + newUser);
	users.push(newUser)
	cb(null, newUser)
    });

}


/*
Function for creating exercise.


  Arguments: uid            -- user id
             desc           -- description
             dur            -- duration
             datePerformed  -- date when exercise happened (optional)
             cb        -- callback function 
*/
function exerciseCreate(uid, desc, dur, datePerformed, cb) {
    let exerciseDetail = {
	userId: uid,
	description: desc,
	duration: dur
    };
    if (datePerformed != false){
	exerciseDetail.date = datePerformed;
    } else {
	exerciseDetail.date = new Date().toISOString().slice(0,10); // gives yyyy-mm-dd format for today
    }

    // Create new exercise mongodb document.
    var newExercise = new Exercise(exerciseDetail);

    // Try to save it, or return an error.
    newExercise.save(function (err) {
	if (err) {
	    cb(err, null)
	    return
	}
	
	console.log('New Exercise: ' + newExercise);
	exercises.push(newExercise)
	cb(null, newExercise)
    });
}


// This function creates some exercises.
function createUsers(cb) {
    async.series([
	function(callback) {
	    userCreate('Annie', callback);
	},
	function(callback) {
	    userCreate("Superman", callback);
	},
	function(callback) {
	    userCreate("Catwoman", callback);
	},
	function(callback) {
	    userCreate("Ray Allen", callback);
	},
    ],
     // optional callback
     cb);
}

// This function creates a few exercises.
function createExercises(cb) {
    async.series([
	function(callback) {
	    exerciseCreate(users[0], 'Frolicking on the back lawn', '10', '2020-07-27', callback);
	},
	function(callback) {
	    exerciseCreate(users[0], 'Eating kibble', '4', '2019-04-27', callback);
	},
	function(callback) {
	    exerciseCreate(users[0], 'Chasing cats', '6', '2015-07-27', callback);
	},
	function(callback) {
	    exerciseCreate(users[0], 'Running', '10', '2016-10-27', callback);
	},	
	function(callback) {
	    exerciseCreate(users[1], 'Scaling buildings', '2', '1970-11-02', callback);
	},
	function(callback) {
	    exerciseCreate(users[2], 'Punching Robin', '3', false, callback);
	},
	function(callback) {
	    exerciseCreate(users[2], 'Whipping Joker', '2', '1999-10-04', callback);
	},
	function(callback) {
	    exerciseCreate(users[2], 'Outrunning the law', '70', '1995-01-14', callback);
	},	
	function(callback) {
	    exerciseCreate(users[3], 'Shooting 3 pointers', '70', '2009-06-04', callback);
	},
    ],
     // optional callback
     cb);
}


// Call all functions in series.
async.series([
    createUsers,
    createExercises
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    }
    else {
        console.log('Exercises: ' + exercises);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
