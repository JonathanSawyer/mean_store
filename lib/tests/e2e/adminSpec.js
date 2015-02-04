var Nav = require('./po/nav'),
	LoginPage = require('./po/login'),
	AdminPage = require('./po/adminMain'),
	testdata = require('./testdata'),
	server = require('./server');

describe('Admin main page', function(){
	beforeEach(server.boot);
	afterEach(server.shutdown);

	beforeEach(function(done){
		var that = this;
		this.nav = new Nav();
		this.login = new LoginPage();
		this.page = new AdminPage();

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
		this.page.get();
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
		this.page.get();
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