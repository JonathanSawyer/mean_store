var Nav = require('./po/nav'),
	db = require('./testdata'),
	ProductList = require('./po/productList'),
	server = require('./server');

describe('Searching', function(){
	var nav, productList;

	beforeEach(server.boot);
	afterEach(server.shutdown);

	beforeEach(function(done){
		nav = new Nav();
		productList = new ProductList();

		var that = this;
		db.clearDB(function(err){
			if (err) return done(err);
			db.createProducts(function(err, prods){
				if (err) return done(err);
				that.products = prods;
				done();
			});
		});
	});

	it('allows finding items', function(){
		var that = this;
		browser.get('#/');
		// GIVEN I am a user
		// WHEN I search for an item
		nav.searchBox.sendKeys('galaxy');
		nav.searchButton.click();
		// THEN I am shown a list of products for which the names contain my
		// search keyword, case insensitive
		productList.productNames.map(function(row){
			return row.getText();
		}).then(function(names){
			if(names[0] === that.products[0].name){
				expect(names[1]).toBe(that.products[1].name);
			}else{
				expect(names[0]).toBe(that.products[1].name);
				expect(names[1]).toBe(that.products[0].name);
			}
		});
	});

	it('gives suggestions', function(){
		browser.get('#/');
		var that = this;

		// GIVEN I am a user
		// WHEN I type my search keyword
		nav.searchBox.sendKeys('alax'); //We will get back the two galaxy phones in the dataset
		nav.searchSuggestions.then(function(suggests){

			// THEN I am shown some results as I am typing
			expect(suggests.length).toBe(2);

			suggests[0].getText().then(function(text){
				var suggest;
				if(text === that.products[0].name){
					suggest = suggests[0];
				}else{
					suggest = suggests[1];
				}
				// AND by clicking on one of them I am shown that product
				suggest.click();
				productList.productNames.then(function(names){
					expect(names.length).toBe(1);
					expect(names[0].getText()).toBe(that.products[0].name);
				});
			});

		});
	});

});
