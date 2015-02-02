//Export auth functions

exports.isAuthenticated = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	console.log("Request not authenticated");
	res.sendStatus(401);
};

exports.isAdmin = function(req, res, next){
	if(req.user && req.user.role === "admin"){
		return next();
	}
	console.log("User is not an admin");
	res.sendStatus(401);
};