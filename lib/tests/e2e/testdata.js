var models = require('../../models');
var Product = models.Product;
var Order = models.Order;
var User = models.User;

module.exports = {
	clearDB : function(done){
		Product.remove(function(err){
			if(err) return done(err);
			User.remove(function(err){
				if(err) return done(err);
				Order.remove(done);
			});
		});
	},
	createUser : function(done){
		var usr = new User({
			firstName : 'Test',
			lastName : 'User',
			email : 'test@test.com',
			streetAddress : 'Street 22',
			postalCode : '12345',
			city : 'Somewhere'
		});
		var pw = 'a';
		usr.hashAndSavePassword(pw, function(err, user){
			if(err) return done(err);
			done(null, user, pw);
		});
	},
	createProducts : function(done){
		var prods = [
		{
			name : 'Galaxy S4',
			price : 199.99,
			category : 'phones',
			description : 'Description for Galaxy S4',
			deleted : false
		},
		{
			name : 'Galaxy S5',
			price : 399.99,
			category : 'phones',
			description : 'Description for Galaxy S5',
			deleted : false
		},
		{
			name : 'Samsung Notebook',
			price : 899.99,
			category : 'computers',
			description : 'Description for a Samsung Notebook',
			deleted : false
		},
		{
			name : 'LG G3',
			price : 359.99,
			category : 'phones',
			description : 'Description for LG G3',
			deleted : true
		}
		];

		Product.create(prods, function(err, p1, p2, p3, p4){
			if (err) return done(err);
			done(null, [p1, p2, p3, p4]);
		});
	}
};