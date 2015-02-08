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
			browser.get('#/');

			// THEN I am still logged in
			expect(this.nav.userDropdown.isDisplayed()).toBeTruthy();
			expect(this.nav.userDropdown.getText()).toBe(user.firstName + ' ' + user.lastName);
		});

		xit('keeps authentication across browser instances with Remember me', function(){
			// GIVEN I am a registered user
			var user = this.user;
			var pw = this.pw;

			// AND I have logged in with the option to remember my credentials
			this.loginPage.get();
			this.loginPage.chkRememberMe.click();
			this.loginPage.login(user.email, pw);

			// AND I have closed the browser or was inactive for a set period
			//Fork a new browser instance
			var browser2, element2;

			// WHEN I navigate to the store
			browser2.get('#/');

			// THEN I am logged back in automatically
			var origElement = element;
			element = element2;
			expect(this.nav.userDropdown.isDisplayed()).toBeTruthy();
			expect(this.nav.userDropdown.getText()).toBe(user.firstName + ' ' + user.lastName);
			element = origElement;
		});

	});

});