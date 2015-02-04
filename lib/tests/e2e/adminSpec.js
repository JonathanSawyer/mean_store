var Nav = require('./po/nav'),
	LoginPage = require('./po/login'),
	testdata = require('./testdata'),
	server = require('./server');

describe('Admin main page', function(){
	beforeEach(server.boot);
	afterEach(server.shutdown);

	beforeEach(function(done){
		var that = this;
		this.nav = new Nav();
		this.login = new LoginPage();
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
					done();
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

});