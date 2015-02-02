var express = require('express'),
	mongoose = require('mongoose'),
	dbConfig = require('./config/db'),
	models = require('./models'),
	path = require('path'),
	http = require('http'),
	routes = require('./routes'),
	passport = require('passport');

var db = mongoose.connect(dbConfig.url, dbConfig.mongooseOpts);

require('./config/passport')(passport);

var session = require('express-session'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser');

var app = express();

app.use(function(req, res, next){
	if(!models.Product || !models.User || !models.Order) return next(new Error('Required models not found'));

	req.models = models;
	return next();
});

app.use(express.static(path.join(__dirname, 'dist')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser('myappsecret'));
app.use(session({secret:'myappsessionsecret', resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

//Configure routes
app.get('/', function(req, res){
	res.sendFile('index.html', {root: 'dist'});
});

require('./routes/index')(app, passport);

app.all('*', function(req, res){
	res.sendStatus(404);
});

if('development' === app.get('env') || 'test' === app.get('env')){
	app.use(function(err, req, res, next){
		err.status = err.status || 500;
		err.message = err.message || 'Error';
		res.status(err.status).send(err.message);
		console.log('Error: ' + err);
		console.log(err.stack);
	});
}else{
	app.use(function(err, req, res, next){
		err.status = err.status || 500;
		res.sendStatus(err.status);
		console.log('Error: ' + err);
	});
}

var server = http.createServer(app);

exports.boot = function(done){
	var port = process.env.PORT;
	var env = process.env.NODE_ENV;
	if(!port){
		if('test' === env){
			port = 8082;
		}else{
			port = 8081;
		}
	}

	server.listen(port, function(){
		console.log('Server up at ' + port);
		if(done) done();
	});
};

exports.shutdown = function(){
	server.close();
};