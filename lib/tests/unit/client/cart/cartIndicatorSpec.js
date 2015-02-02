describe("cartIndicator", function(){
	var $scope, elem, cartService;

	beforeEach(function(){
		module("storeApp.cart");

		module(function($provide){
			cartService = {};
			cartService.getCart = sinon.stub();
			cartService.getCart.returns([]);
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
		cartService.getCart.returns([
		{
			price: 22,
			quantity: 2
		}
		]);
		$scope.$digest();
		expect(elem.html()).toContain('2 items');
		expect(elem.html()).toContain('$44');
	});

	it('shows 0 when there are no items', function(){
		expect(elem.html()).toContain('0 items');
		expect(elem.html()).toContain('$0');
	});

});