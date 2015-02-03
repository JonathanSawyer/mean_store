var AdminMain = function(){
	this.productsTab = element(by.css('.nav-tabs li[active="active.products"] a'));

	this.ordersTab = element(by.css('.nav-tabs li[active="active.orders"] a'));

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