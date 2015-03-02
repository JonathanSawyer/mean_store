var OrderPage = function(){
	this.get = function(){
		browser.get("#/checkout");
	};

	this.btnSubmit = element(by.css('.btn-primary[type="submit"]'));

	this.info = {
		firstName : element(by.model('info.firstName')),
		lastName : element(by.model('info.lastName')),
		streetAddress : element(by.model('info.streetAddress')),
		postalCode : element(by.model('info.postalCode')),
		city : element(by.model('info.city'))
	};

	this.errorMessages = element.all(by.css(".errorMsg"));
};

module.exports = OrderPage;
