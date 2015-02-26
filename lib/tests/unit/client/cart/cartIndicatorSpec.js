describe("cartIndicator directive", function(){
	var $scope, elem, cartService;

	beforeEach(function(){
		module("storeApp.cart");

		module(function($provide){
			cartService = {
				getCart : sinon.stub().returns([])
			};
			$provide.value("cartService", cartService);
		});

		inject(function($compile, $rootScope){
			$scope = $rootScope.$new();

			var html = '<cart-indicator/>';
			elem = $compile(html)($scope);
			$scope.$digest();
		});
	});

	it('shows quantity and price when there are items', function(){
		var productPrice = 22;
		var quantity = 2;
		var total = productPrice * quantity;
		cartService.getCart.returns([
		{
			price: productPrice,
			quantity: quantity
		}
		]);

		$scope.$digest();

		expect(elem.html()).toContain(String(quantity) + ' items');
		expect(elem.html()).toContain('$' + String(total));
	});

	it('shows 0 when there are no items', function(){
		expect(elem.html()).toContain('0 items');
		expect(elem.html()).toContain('$0');
	});

});
