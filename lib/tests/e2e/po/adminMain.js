var AdminMain = function(){
	this.get = function(){
		browser.get('#/admin');
	};

	this.productsTab = element(by.id('productsTab'));

	this.ordersTab = element(by.id('ordersTab'));

	this.btnCreateProduct = element(by.css('.btn[ng-click="createProduct()"]'));

	this.products = {
		rows : element.all(by.repeater('prod in products')),
		names : element.all(by.repeater('prod in products').column('name')),
		prices : element.all(by.repeater('prod in products').column('price')),
		editBtns : element.all(by.css('.btn[ng-click*="editProduct"]'))
	};

	this.orders = {
		rows : element.all(by.repeater('order in orders')),
		times : element.all(by.repeater('order in orders').column('created_at')),
		totals : element.all(by.repeater('order in orders').column('total')),
		sentStatuses : element.all(by.css('.order-status')),
		viewBtns : element.all(by.css('.btn[ng-click*="viewOrder"]'))
	};

};

module.exports = AdminMain;