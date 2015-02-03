var Nav = require('./po/nav'),
	LoginPage = require('./po/login'),
	testdata = require('./testdata'),
	server = require('./server');

describe('Admin main page', function(){
	// beforeEach(server.boot);

	// afterEach(server.shutdown);

	beforeEach(function(done){
		var that = this;
		this.nav = new Nav();
		this.login = new LoginPage();
		testdata.clearDB(function(err){
			if(err) return done(err);
			done();
		});
	});

	it("link is not shown to non-admin users", function(done){
		var that = this;
		// GIVEN I am a registered non-admin user
		testdata.createUser(function(err, user, pw){
			if (err) return done(err);

			// WHEN I log in
			that.login.get();
			that.login.login(user.email, pw);

			// THEN I do not see a link to the admin section
			that.nav.btnAdmin.isDisplayed().then(function(visible){
				expect(visible).toBeFalsy();
				done();
			});
		});
	});

	it('link is shown to admin users', function(done){
		var that = this;
		// GIVEN I am a registered admin user
		testdata.createUser({role:'admin'}, function(err, user, pw){
			if (err) return done(err);

			// WHEN I log in
			that.login.get();
			that.login.login(user.email, pw);

			// THEN I see a link to the admin section
			that.nav.btnAdmin.isDisplayed().then(function(visible){
				expect(visible).toBeTruthy();
				done();
			});
		});
	});

});