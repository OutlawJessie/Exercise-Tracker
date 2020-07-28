var User = require('../models/user')
var async = require('async')


// Display list of all users.
exports.user_list = function (req, res, next) {
    res.json({'users':'will show all users.'});
};

