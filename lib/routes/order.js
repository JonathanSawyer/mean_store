exports.create = function(req, res, next){
	var order = req.body;
	req.models.Order.create(order, function(err, savedOrder){
		if (err) return next(err);

		res.json(savedOrder);
	});
};

exports.find = function(req, res, next){
	var id = req.params.id;
	req.models.Order.findById(id, function(err, order){
		if(err) return next(err);

		res.json(order);
	});
};

exports.del = function(req, res, next){
	var id = req.params.id;
	req.models.Order.findByIdAndRemove(id, function(err){
		if (err) return next(err);

		res.sendStatus(200);
	});
};

exports.list = function(req, res, next){
	req.models.Order.find(function(err, orders){
		if (err) return next(err);

		res.json(orders);
	});
};

exports.update = function(req, res, next){
	var id = req.params.id;
	req.models.Order.findByIdAndUpdate(id, {$set: req.body}, function(err, order){
		if (err) return next(err);

		res.json(order);
	});
};