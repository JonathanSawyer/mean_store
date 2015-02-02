describe("cartService", function(){
	var service;

	beforeEach(module("storeApp.cart"));

	beforeEach(inject(function(cartService){
		service = cartService;
	}));

	describe("addToCart", function(){

		var product = {
			_id : 'aa',
			name: 'Some product'
		};

		it("adds a new item to cart", function(){
			service.addToCart(product);

			var cart = service.getCart();
			expect(cart.length).toEqual(1);
			expect(cart[0].quantity).toEqual(1);
		});

		it("increments quantity of existing item", function(){
			service.addToCart(product);
			service.addToCart(product);

			var cart = service.getCart();
			expect(cart.length).toEqual(1);
			expect(cart[0].quantity).toEqual(2);
		});

	});

});