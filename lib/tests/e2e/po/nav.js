var Nav = function(){
	this.storeTitle        = element(by.className('navbar-brand'));
	this.categoryDropdown  = element(by.id('categoryDropdown'));
	this.categoryAll       = element(by.id('btnAllProducts'));
	this.categoryElements  = element.all(by.repeater('category in categories'));
	this.searchBox         = element(by.model('searchText'));
	this.searchButton      = element(by.css('nav form button'));
	this.cartIndicator     = element(by.id('cartIndicator'));
	this.btnSignup         = element(by.id('btnSignup'));
	this.btnLogin          = element(by.id('btnLogin'));
	this.btnAdmin          = element(by.css('li[ng-show*="admin"]'));
	this.userDropdown      = element(by.id('userDropdown'));
	this.btnlogout         = element(by.css('#userDropdown a[ng-click="logout()"]'));
	this.searchSuggestions = element.all(by.repeater('match in matches'));
};

module.exports = Nav;