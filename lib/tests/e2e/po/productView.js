var ProductView = function(){
	this.product = {
		name : element(by.binding('product.name')),
		description : element(by.binding('product.description')),
		price : element(by.binding('product.price'))
	};

	this.btnAddToCart = element(by.css('.panel-body .btn'));

	this.get = function(product){
		browser.get('#/products/' + product.category + '/' + product._id);
	};
};

module.exports = ProductView;