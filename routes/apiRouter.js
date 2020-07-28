var express = require('express');
var router = express.Router();


// Require our controllers.
var user_controller = require('../controllers/userController');

// -------------ROUTES-------------

// GET request for list of all users.
router.get('/exercise/users', user_controller.user_list);

// -------------END OF ROUTES-------------

// Export router.
module.exports = router;
