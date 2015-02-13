var Nav = require('./po/nav'),
	LoginPage = require('./po/login'),
	AdminPage = require('./po/adminMain'),
	CreateProductPage = require('./po/productCreate'),
	testdata = require('./testdata'),
	server = require('./server'),
	Product = require('../../models/product');

describe('Admin main page', function(){
	beforeEach(server.boot);
	afterEach(server.shutdown);

	beforeEach(function(done){
		var that = this;
		this.nav = new Nav();
		this.login = new LoginPage();
		this.page = new AdminPage();
		this.createProduct = new CreateProductPage();

		testdata.clearDB(function(err){
			if(err) return done(err);
			testdata.createUser({email:'not_admin@store.com'}, function(err, user1, pw1){
				if(err) return done(err);
				that.nonAdminUser = user1;
				that.nonAdminUserPw = pw1;
				testdata.createUser({role:'admin', email:'admin@store.com'}, function(err, user2, pw2){
					if(err) return done(err);
					that.adminUser = user2;
					that.adminUserPw = pw2;
					testdata.createProducts(function(err, prods){
						if(err) return done(err);
						that.products = prods;
						testdata.createOrders(prods, function(err, _orders){
							if(err) return done(err);
							that.orders = _orders;
							done();
						});
					});
				});
			});
		});
	});

	it("link is not shown to non-admin users", function(){
		// GIVEN I am a registered non-admin user
		var user = this.nonAdminUser;
		var pw = this.nonAdminUserPw;
		// WHEN I log in
		this.login.get();
		this.login.login(user.email, pw);
		// THEN I do not see a link to the admin section
		expect(this.nav.btnAdmin.isDisplayed()).toBeFalsy();
	});

	it('link is shown to admin users', function(){
		// GIVEN I am a registered admin user
		var user = this.adminUser;
		var pw = this.adminUserPw;

		// WHEN I log in
		this.login.get();
		this.login.login(user.email, pw);

		// THEN I see a link to the admin section
		expect(this.nav.btnAdmin.isDisplayed()).toBeTruthy();
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

	it('allows creating products', function(done){
		var existingProductsCount = this.products.length;

		// GIVEN I am a registered admin user
		var user = this.adminUser;
		var pw = this.adminUserPw;

		// AND I have logged in
		this.login.get();
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
			Product.find({name : 'New product'}, function(err, prods){
				if(err) return done(err);

				expect(prods.length).toBe(1);
				expect(prods[0].price).toBe(99.99);
				expect(prods[0].category).toBe('computers');
				expect(prods[0].description).toBe('New product description');

				// AND displayed in the product list
				var createdRow = rows.filter(function(row){
					return row.indexOf('New product') >= 0;
				})[0];

				expect(createdRow).toContain('New product');
				expect(createdRow).toContain('99.99');

				done();
			});
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
		this.page.products.names.map(function(row){
			return row.getText();
		}).then(function(names){
			that.page.products.editBtns.then(function(btns){

				var name = names[0];
				var product;
				for (var i = 0; i < that.products.length; i++) {
					if(that.products[i].name === name){
						product = that.products[i];
						break;
					}
				}

				var btn = btns[0];

				btn.click();

				// THEN I am shown a form with the current information
				var editProduct = that.createProduct;
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
					var row = rows.filter(function(row){
						return row.indexOf('New name') >= 0;
					})[0];

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
