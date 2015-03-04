describe("ProductService", function(){
	var prodSvc, $httpBackend;
	var url = "/products/";
	var PRODUCTS = [
	{
		_id: 'a',
		name: "Product1",
		price: 199.99,
		category: "phones",
		description: "Description A",
		deleted : false
	},
	{
		_id: 'b',
		name: "Product2",
		price: 799.99,
		category: "computers",
		description: "Description B",
		deleted : true
	}
	];

	beforeEach(module("storeApp.products"));

	beforeEach(inject(function(productService, _$httpBackend_){
		prodSvc = productService;
		$httpBackend = _$httpBackend_;
	}));

	afterEach(function(){
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	describe("getCategories", function(){

		it("gets categories from the server", function(){
			var categories = ["phones", "computers"];
			$httpBackend.expectGET(url + 'categories')
				.respond(categories);
			var data;

			prodSvc.getCategories().then(function(res){
				data = res;
			});
			$httpBackend.flush();

			expect(data).toEqual(categories);
		});

		it("handles errors", function(){
			$httpBackend.expectGET(url + 'categories').respond(500);
			var err;

			prodSvc.getCategories().then(function(){},
				function(e){
					err = e;
				});
			$httpBackend.flush();

			expect(err).toEqual(500);
		});

	});

	describe("getAll", function(){

		it("returns non-deleted products", function(){
			var nonDelProducts = PRODUCTS.filter(function(item){
				return !item.deleted;
			});

			$httpBackend.expectGET("/products")
				.respond(nonDelProducts);

			var data;

			prodSvc.getAll().then(function(products){
				data = products;
			});
			$httpBackend.flush();
			expect(data).toEqual(nonDelProducts);
		});

		it('gets deleted products also', function(){
			$httpBackend.expectGET('/products?deleted=true')
				.respond(PRODUCTS);

			var data;

			prodSvc.getAll({deleted: true}).then(function(products){
				data = products;
			});
			$httpBackend.flush();

			expect(data).toEqual(PRODUCTS);
		});

	});

	describe("getByCategory", function(){

		it("returns products in a category", function(){
			var cat = "phones";
			var phones = PRODUCTS.filter(function(item){
				return item.category === cat;
			});
			$httpBackend.expectGET("/products/search?category=phones")
				.respond(phones);

			var data;

			prodSvc.getByCategory(cat).then(function(products){
				data = products;
			});
			$httpBackend.flush();

			expect(data).toEqual(phones);
		});

	});

	describe("getById", function(){

		it("returns a product by an id", function(){
			var product = PRODUCTS[PRODUCTS.length - 1];
			var id = product._id;
			$httpBackend.expectGET("/products/" + id).respond(product);

			var data;

			prodSvc.getById(id).then(function(product){
				data = product;
			});
			$httpBackend.flush();

			expect(data).toEqual(product);
		});

	});

	describe("find", function(){

		it("makes a query by name", function(){
			var PRODUCT = PRODUCTS[PRODUCTS.length - 1];
			$httpBackend.expectGET("/products/search?name=" + PRODUCT.name)
				.respond([PRODUCT]);

			var res;
			prodSvc.find(PRODUCT.name).then(function(data){
				res = data;
			});
			$httpBackend.flush();

			expect(res).toEqual([PRODUCT]);
		});

	});

	describe("update", function(){

		it("sends new data to server", function(){
			var PRODUCT = PRODUCTS[0];
			$httpBackend.expectPUT("/products/a").respond(PRODUCT);

			var res;
			prodSvc.update(PRODUCT).then(function(data){
				res = data;
			});
			$httpBackend.flush();

			expect(res).toEqual(PRODUCT);
		});

	});

	describe("remove", function(){

		it("calls a delete to server", function(){
			var PRODUCT = PRODUCTS[0];
			$httpBackend.expectDELETE("/products/a").respond(PRODUCT);

			var res;
			prodSvc.remove(PRODUCT).then(function(data){
				res = data;
			});
			$httpBackend.flush();

			expect(res).toEqual(PRODUCT);
		});

	});

	describe("create", function(){

		it('posts a new product', function(){
			var newProduct = {
				name: "Product1",
				price: 199.99,
				category: "phones",
				description: "Description A"
			};
			var serverRes = {
				_id : 'a',
				name: "Product1",
				price: 199.99,
				category: "phones",
				description: "Description A"
			};

			$httpBackend.expectPOST("/products", newProduct).respond(serverRes);

			var res;
			prodSvc.create(newProduct).then(function(data){
				res = data;
			});
			$httpBackend.flush();

			expect(res).toEqual(serverRes);
		});

	});

});
