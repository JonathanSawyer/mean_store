var ProductList = require('./po/productList');
var Product = require('../../models').Product;
var Nav = require('./po/nav');
var server = require('./server');
var db = require('./testdata');

describe('Product list page', function(){
	var page, products, nav;

	beforeEach(server.boot);
	afterEach(server.shutdown);

	beforeEach(function(done){
		page = new ProductList();
		nav = new Nav();
		db.clearDB(function(err){
			if (err) return done(err);
			db.createProducts(function(err, prods){
				if (err) return done(err);
				products = prods;
				done();
			});
		});
	});

	it('shows items from category', function(){
		browser.get('#/');
		// GIVEN I am a user
		// WHEN I navigate to a product category
		nav.categoryDropdown.click();
		nav.categoryElements.then(function(categories){
			categories[0].click(); //Will be phones

			// THEN I see a list of all non-hidden products in that category
			page.productPanels.then(function(rows){
				expect(rows.length).toEqual(2); //2 phones exist
			});
		});
	});

	it('lists all products', function(){
		// GIVEN I am a user
		// WHEN I browse to "All products"
		page.get('all');

		// THEN I see a list of all non-hidden products in the system
		page.productNames.then(function(rows){
			expect(rows.length).toBe(3);
		});
	});

	it('indicates your shopping cart contents', function(){
		// GIVEN I am a user
		// AND I navigate to a product category
		page.get('phones');
		// WHEN I add a product to my shopping cart
		page.productAddToCartBtns.then(function(btns){
			btns[0].click();
			btns[1].click();
			// THEN an indicator shows how many items I have and what is the total cost
			var indicator = nav.cartIndicator;
			expect(indicator.getText()).toContain('2 items');
			expect(indicator.getText()).toContain('599.98');
		});
		
	});

});