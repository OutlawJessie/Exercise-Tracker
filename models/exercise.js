var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ExerciseSchema = new Schema({
    userId: { type: Schema.ObjectId, ref: 'User', required: true },
    description: {type: String, required: true},
    duration: {type: Number, required: true},
    date: {type: Date}
});


// Export model.
module.exports = mongoose.model('Exercise', ExerciseSchema);
