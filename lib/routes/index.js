var auth = require('../config/auth');

var product = require('./product'),
	user    = require('./user'),
	order   = require('./order');

module.exports = function(app, passport){
	app.get('/products', product.list);
	app.get('/products/search', product.search);
	app.get('/products/categories', product.getCategories);
	app.get('/products/:id', product.find);
	app.post('/products', auth.isAdmin, product.create);
	app.put('/products/:id', auth.isAdmin, product.update);
	app.delete('/products/:id', auth.isAdmin, product.del);

	app.post('/users/signup', user.signup(passport));
	app.post('/users/login', user.login(passport));
	app.get('/users/logout', user.logout);
	app.get('/users/checkauth', user.checkauth);
	app.post('/users/reauth', user.reauth);
	app.get('/users', auth.isAdmin, user.list);
	app.put('/users/:id', auth.isAdmin, user.update);
	app.delete('/users/:id', auth.isAdmin, user.del);

	app.post('/orders', auth.isAuthenticated, order.create);
	app.get('/orders', auth.isAdmin, order.list);
	app.get('/orders/:id', auth.isAdmin, order.find);
	app.delete('/orders/:id', auth.isAdmin, order.del);
	app.put('/orders/:id', auth.isAdmin, order.update);
};