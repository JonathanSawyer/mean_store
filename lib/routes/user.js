
exports.signup = function(passport){
	return function(req, res, next){
		passport.authenticate('local-signup', function(err, user, info){
			if(err) return next(err);

			if(!user) return res.sendStatus(401);

			req.logIn(user, function(err){
				if(err) return next(err);

				return res.json(user);
			});
		})(req, res, next);
	};
};

exports.login = function(passport){
	return function(req, res, next){
		passport.authenticate('local-login', function(err, user, info){
			if(err) return next(err);

			if(!user) return res.sendStatus(401);

			req.logIn(user, function(err){
				if(err) return next(err);
				return res.json(user);
			});
		})(req, res, next);
	};
};

exports.list = function(req, res, next){
	req.models.User.find(function(err, users){
		if (err) return next(err);

		res.json(users);
	});
};

exports.update = function(req, res, next){
	var id = req.params.id;
	req.models.User.findByIdAndUpdate(id, {$set: req.body}, function(err, user){
		if(err) return next(err);

		res.json(user);
	});
};

exports.del = function(req, res, next){
	var id = req.params.id;
	req.models.User.findByIdAndRemove(id, function(err){
		if(err) return next(err);

		res.sendStatus(200);
	});
};

exports.logout = function(req, res){
	req.logout();
	res.sendStatus(200);
};

exports.checkauth = function(req, res){
	if(req.isAuthenticated()){
		res.json({
			auth: true,
			user : req.user
		});
	}else{
		res.json({
			auth : false
		});
	}
};