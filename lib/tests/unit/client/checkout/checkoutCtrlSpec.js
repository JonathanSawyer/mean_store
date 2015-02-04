/* jshint expr: true */
describe('Checkout controller', function(){
	var ctrl, orderService, cartService;
	var $controller, $scope, $rootScope, $location;

	beforeEach(function(){
		module("storeApp.checkout");

		inject(function(_$controller_){
			$controller = _$controller_;
		});

		$scope = {};
		$rootScope = {};
		$location = {};
		orderService = {};
		cartService = {};
	});

	//$scope, $rootScope, $location, orderService, cartService
	function initController(){
		ctrl = $controller("checkoutCtrl", {
			$scope : $scope,
			$rootScope : $rootScope,
			$location : $location,
			orderService : orderService,
			cartService : cartService
		});
	}

	describe('when initialized', function(){

		it("puts the user's info to scope when available on root scope", function(){
			var user = {
				firstName : 'Test',
				lastName : 'User',
				streetAddress : 'Street',
				postalCode : '0000',
				city : 'City'
			};
			$rootScope.user = user;
			
			initController();

			expect($scope.info).toEqual(user);
		});

	});

	describe('submitOrder()', function(){

		var user = {
			firstName : 'Test',
			lastName : 'User',
			streetAddress : 'Street',
			postalCode : '0000',
			city : 'City'
		};

		beforeEach(function(){
			$scope.info = user;
			orderService.create = sinon.stub().returns({
				then : sinon.stub().callsArg(0)
			});
		});

		it('creates an order', function(){
			cartService.clearCart = function(){};
			initController();

			$scope.submitOrder();

			expect(orderService.create).toHaveBeenCalledWith(user);
			expect($scope.orderDone).toEqual(true);
		});

		it('clears the shopping cart', function(){
			cartService.clearCart = sinon.spy();
			initController();

			$scope.submitOrder();

			expect(cartService.clearCart).toHaveBeenCalledOnce;
		});

	});

});