var auth = require('../config/auth');

var product = require('./product'),
	user    = require('./user'),
	order   = require('./order');

module.exports = function(app, passport){
	app.get('/products', product.list);
	app.get('/products/search', product.search);
	app.get('/products/categories', product.getCategories);
	app.get('/products/:id', product.find);
	app.post('/products', auth.isAuthenticated, auth.isAdmin, product.create);
	app.put('/products/:id', auth.isAuthenticated, auth.isAdmin, product.update);
	app.delete('/products/:id', auth.isAuthenticated, auth.isAdmin, product.del);

	app.post('/users/signup', user.signup(passport));
	app.post('/users/login', user.login(passport));
	app.get('/users/logout', user.logout);
	app.get('/users', auth.isAuthenticated, auth.isAdmin, user.list);
	app.put('/users/:id', auth.isAuthenticated, auth.isAdmin, user.update);
	app.delete('/users/:id', auth.isAuthenticated, auth.isAdmin, user.del);
	app.get('/users/checkauth', user.checkauth);

	app.post('/orders', auth.isAuthenticated, order.create);
	app.get('/orders', auth.isAuthenticated, auth.isAdmin, order.list);
	app.get('/orders/:id', auth.isAuthenticated, auth.isAdmin, order.find);
	app.delete('/orders/:id', auth.isAuthenticated, auth.isAdmin, order.del);
	app.put('/orders/:id', auth.isAuthenticated, auth.isAdmin, order.update);
};