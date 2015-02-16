var Nav = require('./po/nav'),
	LoginPage = require('./po/login'),
	AdminPage = require('./po/adminMain'),
	CreateProductPage = require('./po/productCreate'),
	OrderDetails = require('./po/orderDetails'),
	testdata = require('./testdata'),
	server = require('./server'),
	Product = require('../../models/product'),
	Order = require('../../models/order');

describe('Admin main page', function(){
	beforeEach(server.boot);
	afterEach(server.shutdown);

	beforeEach(function(done){
		var that = this;
		this.nav = new Nav();
		this.login = new LoginPage();

		testdata.clearDB(function(err){
			if(err) return done(err);

			done();
		});
	});

	describe("for non admins", function(){
		beforeEach(function(done){
			var that = this;

			testdata.createUser({email:'not_admin@store.com'}, function(err, user, pw){
				if(err) return done(err);
				that.nonAdminUser = user;
				that.nonAdminUserPw = pw;
				done();
			});
		});

		it("link is not shown on navbar", function(){
			// GIVEN I am a registered non-admin user
			var user = this.nonAdminUser;
			var pw = this.nonAdminUserPw;
			// WHEN I log in
			this.login.get();
			this.login.login(user.email, pw);
			// THEN I do not see a link to the admin section
			expect(this.nav.btnAdmin.isDisplayed()).toBeFalsy();
		});
	});

	describe('for admins', function(){

		beforeEach(function(done){
			var that = this;
			this.page = new AdminPage();

			testdata.createUser({role:'admin', email:'admin@store.com'}, function(err, user, pw){
				if(err) return done(err);
				that.adminUser = user;
				that.adminUserPw = pw;
				done();
			});
		});

		it('link is shown on navbar', function(){
			// GIVEN I am a registered admin user
			var user = this.adminUser;
			var pw = this.adminUserPw;

			// WHEN I log in
			this.login.get();
			this.login.login(user.email, pw);

			// THEN I see a link to the admin section
			expect(this.nav.btnAdmin.isDisplayed()).toBeTruthy();
		});

		describe('products', function(){

			describe('listing', function(){

				beforeEach(function(done){
					var that = this;
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
					}];
					Product.create(prods, function(err, p1, p2){
						if (err) return done(err);

						that.products = [p1, p2];
						done();
					});
				});

				it('lists all products', function(){
					var that = this;
					// GIVEN I am a registered admin user
					var user = this.adminUser;
					var pw = this.adminUserPw;

					// AND I have logged in
					this.login.get();
					this.login.login(user.email, pw);

					// WHEN I navigate to the products tab on the admin page
					this.nav.btnAdmin.click();
					this.page.productsTab.click();

					// THEN I see a list of all products in the system
					this.page.products.names.map(function(row){
						return row.getText();
					}).then(function(names){
						var namesMatch = names.every(function(name, i){
							return name === that.products[i].name;
						});
						expect(namesMatch).toBeTruthy();
					});
				});

			});

			describe('creation', function(){

				beforeEach(function(){
					this.createProduct = new CreateProductPage();
				});

				it('allows creating products', function(done){
					browser.get('#/');
					// GIVEN I am a registered admin user
					var user = this.adminUser;
					var pw = this.adminUserPw;

					// AND I have logged in
					this.nav.btnLogin.click();
					this.login.login(user.email, pw);

					// WHEN I choose the option to create a new product on the product list page
					this.nav.btnAdmin.click();
					this.page.btnCreateProduct.click();

					// THEN I am presented with a form to fill in the new product details
					expect(this.createProduct.nameField.isDisplayed()).toBeTruthy();
					expect(this.createProduct.categoryField.isDisplayed()).toBeTruthy();
					expect(this.createProduct.descriptionField.isDisplayed()).toBeTruthy();
					expect(this.createProduct.priceField.isDisplayed()).toBeTruthy();

					// AND WHEN I enter the details
					this.createProduct.nameField.sendKeys('New product');
					this.createProduct.categoryField.sendKeys('computers');
					this.createProduct.descriptionField.sendKeys('New product description');
					this.createProduct.priceField.sendKeys('99.99');

					// AND save the product
					this.createProduct.btnSave.click();

					this.page.products.rows.map(function(row){
						return row.getText();
					}).then(function(rows){
						// THEN the product is created in the database
						Product.find(function(err, prods){
							if(err) return done(err);

							expect(prods.length).toBe(1);
							expect(prods[0].price).toBe(99.99);
							expect(prods[0].category).toBe('computers');
							expect(prods[0].description).toBe('New product description');

							// AND displayed in the product list
							expect(rows.length).toBe(1);
							var createdRow = rows[0];

							expect(createdRow).toContain('New product');
							expect(createdRow).toContain('99.99');

							done();
						});

					});
				});

			});

			describe('editing', function(){

				beforeEach(function(done){
					var that = this;
					this.createProduct = new CreateProductPage();
					var prod = {
						name : 'Galaxy S4',
						price : 199.99,
						category : 'phones',
						description : 'Description for Galaxy S4',
						deleted : false
					};
					Product.create(prod, function(err, product){
						if(err) return done(err);

						that.product = product;
						done();
					});
				});

				it('allows editing products', function(done){
					var that = this;
					// GIVEN I am a registered admin user
					var user = this.adminUser;
					var pw = this.adminUserPw;

					// AND I have logged in
					this.login.get();
					this.login.login(user.email, pw);

					// WHEN I choose to edit a product
					this.nav.btnAdmin.click();
					this.page.products.editBtns.then(function(btns){
						btns[0].click();

						// THEN I am shown a form with the current information
						var editProduct = that.createProduct;
						var product = that.product;
						expect(editProduct.nameField.getAttribute('value')).toBe(product.name);
						expect(editProduct.categoryField.getAttribute('value')).toBe(product.category);
						expect(editProduct.descriptionField.getAttribute('value')).toBe(product.description);
						expect(editProduct.priceField.getAttribute('value')).toBe(String(product.price));

						// AND WHEN I change the information
						editProduct.nameField.clear();
						editProduct.nameField.sendKeys('New name');
						editProduct.categoryField.clear();
						editProduct.categoryField.sendKeys('thingies');
						editProduct.descriptionField.clear();
						editProduct.descriptionField.sendKeys('New description');
						editProduct.priceField.clear();
						editProduct.priceField.sendKeys('9999.99');

						// AND save the changes
						editProduct.btnSave.click();

						// THEN the product's information is modified
						// AND the information is shown in the product list
						that.page.products.rows.map(function(row){
							return row.getText();
						}).then(function(rows){
							var row = rows[0];

							expect(row).toBeTruthy();

							Product.findOne({name : 'New name'}, function(err, prod){
								if (err) return done(err);

								expect(prod).toBeTruthy();

								expect(prod.name).toBe('New name');
								expect(prod.category).toBe('thingies');
								expect(prod.description).toBe('New description');
								expect(prod.price).toBe(9999.99);

								done();
							});
						});

					});

				});

			});

		});

		describe('orders', function(){

			describe('listing', function(){

				beforeEach(function(done){
					var that = this;
					var product = {
						name : 'Phone',
						category : 'phones',
						price : 200,
						description : 'Some phone'
					};
					Product.create(product, function(err, prod){
						if(err) return done(err);

						var orders = [{
							receiver : {
								firstName : 'Test',
								lastName : 'User',
								streetAddress : 'Street 1',
								postalCode : '1111',
								city : 'Some city'
							},
							products : [
								{
									product : prod._id,
									quantity : 1,
									price : prod.price
								}
							],
							sent : false,
							created_at : new Date(2015, 1, 2, 12, 0, 0, 0)
						},
						{
							receiver : {
								firstName : 'Test2',
								lastName : 'User2',
								streetAddress : 'Street 2',
								postalCode : '22222',
								city : 'Some city2'
							},
							products : [
								{
									product : prod._id,
									quantity : 2,
									price : prod.price
								}
							],
							sent : true,
							created_at : new Date(2015, 1, 1, 12, 0, 0, 0)
						}];

						Order.create(orders, function(err, o1, o2){
							if(err) return done(err);
							that.orders = [o1, o2];
							done();
						});
					});
				});

				it('lists all orders', function(){
					var that = this;
					// GIVEN I am a registered admin user
					var user = this.adminUser;
					var pw = this.adminUserPw;

					// AND I have logged in
					this.login.get();
					this.login.login(user.email, pw);

					// WHEN I navigate to the orders tab on the admin page
					this.nav.btnAdmin.click();
					this.page.ordersTab.click();

					// THEN I see a list of all orders in the system
					this.page.orders.times.map(function(row){
						return row.getText();
					}).then(function(times){
						var timesFound = times.every(function(time){
							var found = false;
							var timeObj = new Date(time);
							for(var i = 0; i < that.orders.length; i++){
								if(that.orders[i].created_at.toString() === timeObj.toString()){
									found = true;
									break;
								}
							}
							return found;
						});
						expect(timesFound).toBeTruthy();
					});
				});

			});

			describe("details", function(){
				var order, product, totalPrice;

				beforeEach(function(done){
					this.detailsPage = new OrderDetails();
					product = {
						name : 'Phone',
						category : 'phones',
						price : 200,
						description : 'Some phone'
					};

					Product.create(product, function(err, prod){
						if (err) return done(err);

						order = {
							receiver : {
								firstName : 'Test',
								lastName : 'User',
								streetAddress : 'Street 1',
								postalCode : '1111',
								city : 'Some city'
							},
							products : [
								{
									product : prod._id,
									quantity : 2,
									price : prod.price
								}
							],
							sent : false,
							created_at : new Date(2015, 1, 2, 12, 0, 0, 0)
						};

						total = order.products[0].price * order.products[0].quantity;

						Order.create(order, function(err){
							if(err) return done(err);
							done();
						});
					});

				});

				it('allows setting an order as sent', function(){
					var that = this;
					var detailsPage = new OrderDetails();
					browser.get('#/');
					// GIVEN I am an admin user
					var user = this.adminUser;
					var pw = this.adminUserPw;

					// AND I have logged in
					this.nav.btnLogin.click();
					this.login.login(user.email, pw);

					// AND I am in viewing the details of an unsent order in the admin view
					this.nav.btnAdmin.click();
					this.page.ordersTab.click();
					this.page.orders.viewBtns.then(function(btns){
						btns[0].click();

						// WHEN I set the order as sent
						detailsPage.btnSetAsSent.click();

						// THEN the list of orders shows it as sent
						that.page.orders.sentStatuses.then(function(statuses){
							expect(statuses[0].getText()).toBe('Yes');
						});
					});

				});

				it("shows details of an order", function(){
					var that = this;
					browser.get('#/');

					// GIVEN I am a registered admin user
					var user = this.adminUser;
					var pw = this.adminUserPw;

					// AND I have logged in
					this.nav.btnLogin.click();
					this.login.login(user.email, pw);

					// AND I am in the order administration view
					this.nav.btnAdmin.click();
					this.page.ordersTab.click();

					// WHEN I choose the option to view an order
					this.page.orders.viewBtns.then(function(btns){
						btns[0].click();

						// THEN I am shown the delivery information, the products, and the total sum of the order
						expect(that.detailsPage.receiver.firstName.getText()).toEqual(order.receiver.firstName);
						expect(that.detailsPage.receiver.lastName.getText()).toEqual(order.receiver.lastName);
						expect(that.detailsPage.receiver.address.getText()).toEqual(order.receiver.streetAddress);
						expect(that.detailsPage.receiver.postalCode.getText()).toEqual(order.receiver.postalCode);
						expect(that.detailsPage.receiver.city.getText()).toEqual(order.receiver.city);

						var total = order.products.reduce(function(prev, cur){
							return prev + (cur.quantity * cur.price);
						}, 0);

						expect(that.detailsPage.total.getText()).toContain(String(total));
						that.detailsPage.productNames.getText().then(function(names){
							expect(names.length).toBe(order.products.length);
						});
					});
				});

			});

		});

	});

});
