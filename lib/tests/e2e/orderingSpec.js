var ProductList = require('./po/productList');
var Product = require('../../models').Product;
var Order = require('../../models').Order;
var User = require('../../models').User;
var Nav = require('./po/nav');
var LoginPage = require('./po/login');
var CartPage = require('./po/cart');
var OrderPage = require('./po/order');
var testdata = require('./testdata');
var server = require('./server');

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
				testdata.createUser(function(err, _user, _pw){
					if (err) return done(err);
					user = _user;
					pw = _pw;
					done();
				});
			});
		});
	});

	it('allows making an order', function(done){
		// GIVEN I am a user of the system
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
					}, 0);
					var expectedTotal = products[0].price + products[1].price;

					expect(total).toEqual(expectedTotal);
					done();
				});
			});

		});

	});

	it("gets a registered user's info on the order page", function(){
		// GIVEN I am a registered user
		// AND I have logged in
		loginPage.get();
		loginPage.login(user.email, pw);

		// WHEN I add a product to my shopping cart
		nav.categoryDropdown.click();
		nav.categoryAll.click();
		productList.productAddToCartBtns.then(function(btns){
			btns[0].click();

			// AND I go to order it
			nav.cartIndicator.click();
			cart.btnGoToOrder.click();

			// THEN my information is automatically filled into the fields
			expect(orderPage.info.firstName.getAttribute('value')).toEqual(user.firstName);
			expect(orderPage.info.lastName.getAttribute('value')).toEqual(user.lastName);
			expect(orderPage.info.streetAddress.getAttribute('value')).toEqual(user.streetAddress);
			expect(orderPage.info.postalCode.getAttribute('value')).toEqual(user.postalCode);
			expect(orderPage.info.city.getAttribute('value')).toEqual(user.city);
		});

	});

	it("shows an error message if first name is missing", function(){
		//	GIVEN I am a user
		//	WHEN I am making an order
		orderPage.get();

		//	AND I leave one or more required fields empty
		orderPage.info.firstName.sendKeys("Test");
		orderPage.info.lastName.sendKeys("User");
		orderPage.info.streetAddress.sendKeys("Street 1");
		orderPage.info.postalCode.sendKeys("01234");
		orderPage.info.city.sendKeys("City");

		orderPage.info.firstName.clear();

		//	THEN I am shown an error message
		orderPage.errorMessages.then(function(msgs){
			expect(msgs[0].getText()).toContain("first name");
			expect(msgs[0].isDisplayed()).toBeTruthy();
			//	AND the order cannot be sent
			expect(orderPage.btnSubmit.isEnabled()).toBeFalsy();
		});

	});

	it("shows an error message if last name is missing", function(){
		//	GIVEN I am a user
		//	WHEN I am making an order
		orderPage.get();

		//	AND I leave one or more required fields empty
		orderPage.info.firstName.sendKeys("Test");
		orderPage.info.lastName.sendKeys("User");
		orderPage.info.streetAddress.sendKeys("Street 1");
		orderPage.info.postalCode.sendKeys("01234");
		orderPage.info.city.sendKeys("City");

		orderPage.info.lastName.clear();

		//	THEN I am shown an error message
		orderPage.errorMessages.then(function(msgs){
			expect(msgs[1].getText()).toContain("last name");
			expect(msgs[1].isDisplayed()).toBeTruthy();
			//	AND the order cannot be sent
			expect(orderPage.btnSubmit.isEnabled()).toBeFalsy();
		});
	});

	it("shows an error message if street address is missing", function(){
		//	GIVEN I am a user
		//	WHEN I am making an order
		orderPage.get();

		//	AND I leave one or more required fields empty
		orderPage.info.firstName.sendKeys("Test");
		orderPage.info.lastName.sendKeys("User");
		orderPage.info.streetAddress.sendKeys("Street 1");
		orderPage.info.postalCode.sendKeys("01234");
		orderPage.info.city.sendKeys("City");

		orderPage.info.streetAddress.clear();

		//	THEN I am shown an error message
		orderPage.errorMessages.then(function(msgs){
			expect(msgs[2].getText()).toContain("address");
			expect(msgs[2].isDisplayed()).toBeTruthy();
			//	AND the order cannot be sent
			expect(orderPage.btnSubmit.isEnabled()).toBeFalsy();
		});
	});

	it("shows an error message if postal code is missing", function(){
		//	GIVEN I am a user
		//	WHEN I am making an order
		orderPage.get();

		//	AND I leave one or more required fields empty
		orderPage.info.firstName.sendKeys("Test");
		orderPage.info.lastName.sendKeys("User");
		orderPage.info.streetAddress.sendKeys("Street 1");
		orderPage.info.postalCode.sendKeys("01234");
		orderPage.info.city.sendKeys("City");

		orderPage.info.postalCode.clear();

		//	THEN I am shown an error message
		orderPage.errorMessages.then(function(msgs){
			expect(msgs[3].getText()).toContain("postal code");
			expect(msgs[3].isDisplayed()).toBeTruthy();
			//	AND the order cannot be sent
			expect(orderPage.btnSubmit.isEnabled()).toBeFalsy();
		});
	});

	it("shows an error message if city is missing", function(){
		//	GIVEN I am a user
		//	WHEN I am making an order
		orderPage.get();

		//	AND I leave one or more required fields empty
		orderPage.info.firstName.sendKeys("Test");
		orderPage.info.lastName.sendKeys("User");
		orderPage.info.streetAddress.sendKeys("Street 1");
		orderPage.info.postalCode.sendKeys("01234");
		orderPage.info.city.sendKeys("City");

		orderPage.info.city.clear();

		//	THEN I am shown an error message
		orderPage.errorMessages.then(function(msgs){
			expect(msgs[4].getText()).toContain("city");
			expect(msgs[4].isDisplayed()).toBeTruthy();
			//	AND the order cannot be sent
			expect(orderPage.btnSubmit.isEnabled()).toBeFalsy();
		});
	});

});
