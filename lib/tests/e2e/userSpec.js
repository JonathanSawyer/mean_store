var Nav = require('./po/nav'),
	Login = require('./po/login'),
	server = require('./server'),
	db = require('./testdata');

describe("User accounts:", function(){

	beforeEach(server.boot);
	afterEach(server.shutdown);

	beforeEach(function(done){
		var that = this;
		this.nav = new Nav();
		this.loginPage = new Login();
		db.clearDB(function(err){
			if(err) return done(err);
			db.createUser(function(err, user, pw){
				if(err) return done(err);
				that.user = user;
				that.pw = pw;
				done();
			});
		});
	});

	describe("log out", function(){

		it("hides user information", function(){
			// GIVEN I am a registered user
			var user = this.user;
			var pw = this.pw;

			// AND I have logged in
			this.loginPage.get();
			this.loginPage.login(user.email, pw);

			// WHEN I click on Logout
			this.nav.userDropdown.click();
			this.nav.btnLogout.click();

			// THEN My user information is no longer shown
			expect(this.nav.userDropdown.isDisplayed()).toBeFalsy();
			expect(this.nav.userDropdown.getText()).toBeFalsy();
		});

	});

});