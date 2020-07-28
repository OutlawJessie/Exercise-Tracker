var User = require('../models/user')
var async = require('async')




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

