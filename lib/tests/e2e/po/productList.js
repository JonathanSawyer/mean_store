var ProductList = function(){
	this.get = function(category){
		var cat = category || 'all';
		browser.get('#/products/' + cat);
	};
	this.productPanels = element.all(by.repeater('prod in products'));
	this.productNames = element.all(by.repeater('prod in products').column('prod.name'));
	this.productPrices = element.all(by.repeater('prod in products').column('prod.price'));
	this.productDescriptions = element.all(by.repeater('prod in products').column('prod.description'));
	this.productAddToCartBtns = element.all(by.css('.panel-body button'));
};

module.exports = ProductList;
