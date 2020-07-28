var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    user_name: { type: String, required: true, maxlength: 100 }
});


// Export model.
module.exports = mongoose.model('User', UserSchema);
