var ProductList = require('./po/productList');
var Product = require('../../models').Product;
var Order = require('../../models').Order;
var User = require('../../models').User;
var Nav = require('./po/nav');
var LoginPage = require('./po/login');
var CartPage = require('./po/cart');
var OrderPage = require('./po/order');
var server = require('./server');
var testdata = require('./testdata');

describe('ordering', function(){
	var productList, products, loginPage, cart, orderPage, user, pw;

	beforeEach(server.boot);

	afterEach(server.shutdown);

	beforeEach(function(done){
		productList = new ProductList();
		nav = new Nav();
		loginPage = new LoginPage();
		cart = new CartPage();
		orderPage = new OrderPage();

		testdata.clearDB(function(err){
			if(err) return done(err);

			testdata.createProducts(function(err, prods){
				if (err) return done(err);
				products = prods;
				done();
			});
		});
	});

	it('allows making an order', function(done){
		// GIVEN I am a user of the system
		testdata.createUser(function(err, user, pw){
			if(err) return done(err);
			// AND I am logged in
			loginPage.get();
			loginPage.login(user.email, pw);

			// WHEN I browse to a category
			productList.get('phones');
			// AND add products to my shopping cart
			productList.productAddToCartBtns.then(function(btns){
				btns[0].click();
				btns[1].click();

				// AND go to my cart
				nav.cartIndicator.click();

				// AND go to order
				cart.btnGoToOrder.click();

				// AND submit the order
				orderPage.btnSubmit.click().then(function(){
					// THEN the order is sent
					Order.find(function(err, orders){
						if (err) return done(err);

						expect(orders.length).toEqual(1);
						var order = orders[0];
						expect(order.receiver.firstName).toEqual(user.firstName);
						expect(order.receiver.lastName).toEqual(user.lastName);
						expect(order.receiver.streetAddress).toEqual(user.streetAddress);
						expect(order.receiver.postalCode).toEqual(user.postalCode);
						expect(order.receiver.city).toEqual(user.city);

						var total = order.products.reduce(function(prev, cur){
							return prev + (cur.quantity * cur.price);
						});

						var expectedTotal = products[0].price + products[1].price;
						expect(total).toEqual(expectedTotal);
						done();
					});
				});
				
			});
		});
		
	});

});