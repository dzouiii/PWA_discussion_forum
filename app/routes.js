var User 		= require('../app/models/user');
var Topic 		= require('../app/models/topic');
var Response    = require('../app/models/response');

module.exports = function(app, passport) {

	// HOME PAGE (with login links)
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// LOGIN
	// show the login form
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

	// SINGUP
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

	// PROFILE SECTION
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		// get all the users
		Topic.find({}, function(err, topics) {
			res.render('profile.ejs', {"topics" : topics, user : req.user
			});
		});
	});

	//LOGOUT
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// CREATE NEW TOPIC
	app.get('/new_topic', isLoggedIn, function(req, res) {
		res.render('new_topic.ejs');
	});

	// SAVING NEW TOPIC AND REDIRECT
	app.post('/new_topic', isLoggedIn, function(req, res) {
		var new_topic = new Topic({topic: {title: req.body.title, author: req.user.local.email, text: req.body.text, date: Date.now()}});

		new_topic.save(function(err, new_topic){
			if (err) return console.err(err);
		});

		console.log(req.body);
		res.redirect('/profile');
	});

	// SEARCH TOPIC AND REDIRECT
	app.get('/topic/:id*', isLoggedIn, function(req, res) {
		var id = req.param('id');

		Topic.findOne({ '_id' : id }, function(err, topic){
			if (err) return console.err(err);

			//res.render('topic.ejs', {"topic" : topic
			//});

			Response.find({ 'response.topic_id' : id}, function(err, responses) {
				if (err) return console.err(err);

				console.log(responses);
				console.log(topic);
				res.render('topic.ejs', {
					"topic": topic, user: req.user, "responses": responses
				});
			});
		});
	});

	// DELETING TOPIC
	app.get('/delete_topic/:id*', isLoggedIn, function(req, res) {
		var id = req.param('id');

		Topic.remove({ '_id' : id }, function(err, topic){
			if (err) return console.err(err);
		});

		res.redirect('/profile');
	});

	//RESPONSE ON TOPIC
	app.get('/response/:id*', isLoggedIn, function(req, res) {
		var id = req.param('id');

		res.render('response.ejs', {'id': id
		});
	});

	app.post('/response/:id*', isLoggedIn, function(req, res) {
		var new_response = new Response({response: {topic_id: req.param('id'), text: req.body.text, author: req.user.local.email, date: Date.now()}});

		new_response.save(function(err, new_response){
			if (err) return console.err(err);
		});

		console.log(new_response);
		res.redirect('/profile');
	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}