var LoginPage = function(){
	this.get = function(){
		browser.get('#/login');
	};

	this.emailField = element(by.model('user.email'));
	this.pwField = element(by.model('user.password'));
	this.btnLogin = element(by.css('.btn-primary'));
	this.chkRememberMe = element(by.model('user.rememberMe'));

	this.login = function(email, pw){
		this.emailField.sendKeys(email);
		this.pwField.sendKeys(pw);
		this.btnLogin.click();
	};
};

module.exports = LoginPage;