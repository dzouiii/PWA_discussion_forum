var Topic 		= require('../app/models/topic');
var Response    = require('../app/models/response');

module.exports = function(app, passport) {

	// HOME PAGE
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	// LOGIN
	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/topics',
        failureRedirect : '/login',
        failureFlash : true
    }));

	// SINGUP
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/topics',
        failureRedirect : '/signup',
        failureFlash : true
    }));

	//LOGOUT
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// TOPICS SECTION
	app.get('/topics', isLoggedIn, function(req, res) {
		Topic.find({}, function(err, topics) {
			res.render('topics.ejs', {"topics" : topics, user : req.user
			});
		});
	});

	// CREATE NEW TOPIC
	app.get('/new_topic', isLoggedIn, function(req, res) {
		res.render('new_topic.ejs');
	});

	// SAVING NEW TOPIC AND REDIRECT
	app.post('/new_topic', isLoggedIn, function(req, res) {
		var new_topic = new Topic({topic: {title: req.body.title, author: req.user.local.nickname, text: req.body.text, date: Date.now()}});

		new_topic.save(function(err){
			if (err) return console.err(err);
		});

		res.redirect('/topics');
	});

	// SEARCH TOPIC, RESPONSES AND RENDER
	app.get('/topic/:id*', isLoggedIn, function(req, res) {
		var id = req.param('id');

		Topic.findOne({ '_id' : id }, function(err, topic){
			if (err) return console.err(err);

			Response.find({ 'response.topic_id' : id}, function(err, responses) {
				if (err) return console.err(err);

				res.render('topic.ejs', {
					"topic": topic, user: req.user, "responses": responses
				});
			});
		});
	});

	// DELETE TOPIC
	app.get('/delete_topic/:id*', isLoggedIn, function(req, res) {
		var id = req.param('id');

		Topic.remove({ '_id' : id }, function(err){
			if (err) return console.err(err);
		});

		res.redirect('/topics');
	});

	//RESPONSE ON TOPIC
	app.get('/response/:id*', isLoggedIn, function(req, res) {
		var id = req.param('id');

		res.render('response.ejs', {'id': id
		});
	});

	app.post('/response/:id*', isLoggedIn, function(req, res) {
		var new_response = new Response({response: {topic_id: req.param('id'), text: req.body.text, author: req.user.local.nickname, date: Date.now()}});

		new_response.save(function(err){
			if (err) return console.err(err);
		});

		res.redirect('/topics');
	});
};

// ROUTE MIDDLEWARE pro zjištění, zda je uživatel přihlášen
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}