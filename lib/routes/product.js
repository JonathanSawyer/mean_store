exports.list = function(req, res, next){
	var opts = {};

	if(!(req.user && req.user.role === 'admin' && !!req.query.deleted)){
		opts.deleted = false;
	}

	req.models.Product.find(opts, function(err, products){
		if(err) return next(err);
		res.json(products);
	});
};

exports.search = function(req, res, next){
	var opts = {};
	if(req.query.category && "all" !== req.query.category){
		opts.category = req.query.category;
	}
	if(req.query.name){
		//containing query + case-insensitive
		opts.name = new RegExp(req.query.name, "i");
	}
	if(!(req.user && req.user.role === 'admin' && !!req.query.deleted))
		opts.deleted = false;

	req.models.Product.find(opts, function(err, products){
		if(err) return next(err);
		res.json(products);
	});
};

exports.find = function(req, res, next){
	var id = req.params.id;
	req.models.Product.findById(id, function(err, product){
		if(err) return next(err);

		if(!product) return res.sendStatus(404);

		res.json(product);
	});
};

exports.create = function(req, res, next){
	var product = req.body;
	req.models.Product.create(product, function(err, prod){
		if(err) return next(err);

		res.json(prod);
	});
};

exports.update = function(req, res, next){
	var id = req.params.id;
	if(req.body._id){
		delete req.body._id;
	}
	req.models.Product.findByIdAndUpdate(id, {$set: req.body}, function(err, product){
		if(err) return next(err);

		res.json(product);
	});
};

exports.del = function(req, res, next){
	var id = req.params.id;
	req.models.Product.findByIdAndUpdate(id, {deleted: true}, function(err){
		if(err) return next(err);
		res.sendStatus(200);
	});
};

exports.getCategories = function(req, res, next){
	req.models.Product.getCategories(function(err, categories){
		if(err) return next(err);

		res.json(categories);
	});
};
