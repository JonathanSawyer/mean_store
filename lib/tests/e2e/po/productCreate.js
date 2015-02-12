var ProductCreate = function(){
	this.get = function(){
		browser.get('#/admin/products/new');
	};

	this.nameField = element(by.model('product.name'));
	this.categoryField = element(by.model('product.category'));
	this.categorySuggestions = element.all(by.repeater('match in matches'));
	this.descriptionField = element(by.model('product.description'));
	this.priceField = element(by.model('product.price'));
	this.btnSave = element(by.css('.btn-primary[ng-click*="save"]'));
};

module.exports = ProductCreate;