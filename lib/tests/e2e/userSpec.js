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

	describe("login", function(){

		it('keeps authentication when page is refreshed', function(){
			// GIVEN I am a registered user
			var user = this.user;
			var pw = this.pw;

			// AND I have logged in
			this.loginPage.get();
			this.loginPage.login(user.email, pw);

			// WHEN I refresh the page
			browser.refresh();

			// THEN I am still logged in
			expect(this.nav.userDropdown.isDisplayed()).toBeTruthy();
			expect(this.nav.userDropdown.getText()).toBe(user.firstName + ' ' + user.lastName);
		});

		it('keeps authentication across browser instances with Remember me', function(){
			var that = this;
			// GIVEN I am a registered user
			var user = this.user;
			var pw = this.pw;

			// AND I have logged in with the option to remember my credentials
			this.loginPage.get();
			this.loginPage.chkRememberMe.click();
			this.loginPage.login(user.email, pw);

			this.nav.userDropdown.getText().then(function(text){
				// AND I have closed the browser or was inactive for a set period
				browser.manage().deleteCookie('connect.sid');

				// WHEN I navigate to the store
				browser.get('#/');

				// THEN I am logged back in automatically
				expect(that.nav.userDropdown.isDisplayed()).toBeTruthy();
				expect(that.nav.userDropdown.getText()).toBe(user.firstName + ' ' + user.lastName);
			});
		});

		it("rejects login with incorrect password", function(){
			// GIVEN I am a registered user
			var user = this.user;
			var pw = this.pw + "wrong";

			// WHEN I try to login with my email and an incorrect password
			this.loginPage.get();
			this.loginPage.login(user.email, pw);

			// THEN a message is shown to me which tells me either my email or password was wrong
			expect(this.loginPage.errorMsg.isDisplayed()).toBeTruthy();
			expect(this.loginPage.errorMsg.getText()).toBe("Invalid email or password");
		});

	});

});
