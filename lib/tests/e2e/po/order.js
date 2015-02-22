var OrderPage = function(){
	this.btnSubmit = element(by.css('.btn-primary[type="submit"]'));

	this.info = {
		firstName : element(by.model('info.firstName')),
		lastName : element(by.model('info.lastName')),
		streetAddress : element(by.model('info.streetAddress')),
		postalCode : element(by.model('info.postalCode')),
		city : element(by.model('info.city'))
	};
};

module.exports = OrderPage;
