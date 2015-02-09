//Export auth functions

exports.isAuthenticated = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.sendStatus(401);
};

exports.isAdmin = function(req, res, next){
	if(req.isAuthenticated() && req.user && req.user.role === "admin"){
		return next();
	}
	res.sendStatus(401);
};