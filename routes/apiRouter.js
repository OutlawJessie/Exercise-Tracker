var express = require('express');
var router = express.Router();


// Require our controllers.
var user_controller = require('../controllers/userController');

// -------------ROUTES-------------


// Create or POST new username.
// Must match action part in form.
router.post('/exercise/new-user', user_controller.post_user);

// Read single user's exercise log with GET request.
router.get('/exercise/log', user_controller.get_single_user);


// Read list of all users with GET request.
router.get('/exercise/users', user_controller.user_list);

// -------------END OF ROUTES-------------

// Export router.
module.exports = router;
