var LocalStrategy = require('passport-local').Strategy;
var User = require("../models").User;

module.exports = function(passport){

	passport.serializeUser(function(user, done){
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, done);
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, pw, done){
		process.nextTick(function(){
			email = email.toLowerCase();
			User.findOne({email: email}, function(err, user){
				if(err) return done(err);

				if(user){
					return done(null, false);
				}else{
					var newUser = new User({
						firstName : req.body.firstName,
						lastName : req.body.lastName,
						email : email,
						streetAddress : req.body.streetAddress,
						postalCode : req.body.postalCode,
						city : req.body.city
					});

					newUser.hashAndSavePassword(pw, function(err, savedUser){
						if(err) return done(err, savedUser);

						savedUser.password = undefined;
						done(null, savedUser);
					});

				}
			});
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, pw, done){
		//PASSWORD IS NOT SELECTED BY DEFAULT
		User.findOne({email: email}, "+password", function(err, user){
			if(err) return done(err);

			if(!user) return done(null, false);

			user.isValidPassword(pw, function(err, res){
				if(err) return done(err);

				if(!res) return done(null, false);

				user.password = undefined;
				return done(null, user);
			});
		});
	}));

};