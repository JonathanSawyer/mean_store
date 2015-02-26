describe("Cart service", function(){
	var service;

	beforeEach(module("storeApp.cart"));

	beforeEach(inject(function(cartService){
		service = cartService;
	}));

	describe("addToCart()", function(){

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

	describe('incrementQuantity', function(){
		var product;

		beforeEach(function(){
			product = {
				_id : 'aa',
				name: 'Some product'
			};
			service.addToCart(product);
		});

		it('increments the quantity of an existing item', function(){
			service.incrementQuantity(product);

			var cart = service.getCart();
			expect(cart.length).toBe(1);
			expect(cart[0].quantity).toBe(2);
		});

		it('does nothing for a non-existing item', function(){
			var prod = {
				_id : 'bb',
				name : 'something else'
			};

			service.incrementQuantity(prod);

			var cart = service.getCart();
			expect(cart.length).toBe(1);
			expect(cart[0].quantity).toBe(1);
		});

	});

	describe('decrementQuantity', function(){
		var product;

		beforeEach(function(){
			product = {
				_id : 'aa',
				name: 'Some product'
			};
			service.addToCart(product);
			service.addToCart(product);
		});

		it('subtracts 1 from quantity of existing item', function(){
			service.decrementQuantity(product);

			var cart = service.getCart();
			expect(cart.length).toBe(1);
			expect(cart[0].quantity).toBe(1);
		});

		it('does not reduce it to 0', function(){
			service.decrementQuantity(product);
			service.decrementQuantity(product);

			var cart = service.getCart();
			expect(cart.length).toBe(1);
			expect(cart[0].quantity).toBe(1);
		});

		it('does nothing for a non-existing product', function(){
			var prod = {
				_id : 'bb',
				name : 'something else'
			};

			service.decrementQuantity(prod);

			var cart = service.getCart();
			expect(cart.length).toBe(1);
			expect(cart[0].quantity).toBe(2);
		});

	});

	describe('removeItem', function(){
		var products;

		beforeEach(function(){
			products = [
			{
				_id : 'a'
			},
			{
				_id : 'b'
			}
			];
			service.addToCart(products[0]);
			service.addToCart(products[1]);
		});

		it('removes an existing item', function(){
			service.removeItem(products[1]);

			var cart = service.getCart();
			expect(cart.length).toBe(1);
			expect(cart[0]).toEqual(products[0]);
		});

	});

	describe('clearCart', function(){
		beforeEach(function(){
			var products = [
			{
				_id : 'a'
			},
			{
				_id : 'b'
			}
			];
			service.addToCart(products[0]);
			service.addToCart(products[1]);
		});

		it('removes all items', function(){
			service.clearCart();

			var cart = service.getCart();
			expect(cart.length).toBe(0);
		});

	});

});
