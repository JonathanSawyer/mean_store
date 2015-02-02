var ProductView = require('./po/productView');
var Nav = require('./po/nav');
var server = require('./server');
var testdata = require('./testdata');

describe('Product view', function(){

	beforeEach(server.boot);

	afterEach(server.shutdown);

	beforeEach(function(done){
		var that = this;
		this.nav = new Nav();
		this.page = new ProductView();
		testdata.clearDB(function(err){
			if(err) return done(err);

			testdata.createProducts(function(err, prods){
				if (err) return done(err);
				that.products = prods;
				done();
			});
		});
	});

	it('allows adding a product to cart', function(){
		var prod = this.products[0];
		// GIVEN I am a user
		// AND I am viewing a product's details
		this.page.get(prod);
		// WHEN I add the product to my shopping cart
		this.page.btnAddToCart.click();
		// THEN an indicator shows how many items I have and what is the total cost
		expect(this.nav.cartIndicator.getText()).toContain("1 item");
		expect(this.nav.cartIndicator.getText()).toContain(String(prod.price));
	});

	it('allows adding multiple products to cart', function(){
		var prod = this.products[0];
		// GIVEN I am a user
		// AND I am viewing a product's details
		this.page.get(prod);
		// WHEN I add the product to my shopping cart
		this.page.btnAddToCart.click();
		this.page.btnAddToCart.click();
		// THEN an indicator shows how many items I have and what is the total cost
		expect(this.nav.cartIndicator.getText()).toContain("2 items");
		expect(this.nav.cartIndicator.getText()).toContain(String(prod.price * 2));
	});

});