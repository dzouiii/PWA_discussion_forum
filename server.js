var express  = require('express');
var app		 = express();
var port	 = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash	 = require('connect-flash');

var morgan		 = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser	 = require('body-parser');
var session		 = require('express-session');

var configDB	 = require('./config/database.js');

// připojení k db
mongoose.connect(configDB.url);

// konfigurace passportu
require('./config/passport')(passport);

// každý request vypsat v konzoli
app.use(morgan('dev'));
// čtení cookies (potřebné pro auth)
app.use(cookieParser());
// data z html formů
app.use(bodyParser());

// nastavení ejs pro template
app.set('view engine', 'ejs');

app.use(session({ secret: 'K2lm8Id1SawB3' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// načtení routes a passportu
require('./app/routes.js')(app, passport);

app.listen(port);