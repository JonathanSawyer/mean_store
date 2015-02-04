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
	createUser : function(opts, done){
		if(opts && !done){
			done = opts;
			opts = {};
		}
		var role = opts.role;
		var usr = new User({
			firstName : 'Test',
			lastName : 'User',
			email : opts.email || 'test@test.com',
			streetAddress : 'Street 22',
			postalCode : '12345',
			city : 'Somewhere',
			role : role
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
	},
	createOrders : function(products, done){
		if(products.length < 2) throw new Error("Not enough products!");

		var orders = [
		{
			receiver : {
				firstName : 'Test1',
				lastName : 'User',
				streetAddress : 'Street 1',
				postalCode : '11111',
				city : 'Somewhere'
			},
			products : [
			{
				product : products[0]._id,
				quantity : 1,
				price : products[0].price
			}
			],
			sent : false,
			created_at : new Date(2015, 1, 2, 12, 0, 0, 0)
		},
		{
			receiver : {
				firstName : 'Test2',
				lastName : 'User',
				streetAddress : 'Street 2',
				postalCode : '22222',
				city : 'Somewhere'
			},
			products : [
			{
				product : products[0]._id,
				quantity : 1,
				price : products[0].price
			},
			{
				product : products[1]._id,
				quantity : 2,
				price : products[1].price
			}
			],
			sent : true,
			created_at: new Date(2015, 1, 1, 12, 0, 0, 0)
		}
		];

		Order.create(orders, function(err, o1, o2){
			if (err) return done(err);
			done(null, [o1, o2]);
		});
	}
};