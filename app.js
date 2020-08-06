// Load/Require express libray, and start an app.
var express = require("express");
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');

// Start express app.
var app = express();

// Use CORS so FCC can test stuff.
var cors = require('cors');
app.use(cors());

// Load/Require dotenv package for local environment variables,
// and configure it.
require('dotenv').config()


// Set up database connection.
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB,
		 { useNewUrlParser: true,
		   useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Body parser to more easily access request body.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Link up public folder for .css stylesheet.
app.use(express.static("public"));


// From the current working directory (CWD), send the index page.
app.route('/')
  .get(function (req, res) {
      res.sendFile(process.cwd() + '/views/index.html');
  });

// Call api router.
var apiRouter = require('./routes/apiRouter');
app.use('/api', apiRouter);


// Add page for not found 404 error.
app.use(function(req, res, next){
   res.status(404);
   res.type('txt').send('Page Not Found');
 });
// Listen on port 3000.
app.listen(process.env.PORT || 3000, function () {
  console.log('server.js is listening on port 3000');
});

module.exports = app;
