/* jshint expr: true */
describe('checkoutCtrl', function(){
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
	function getController(){
		ctrl = $controller("checkoutCtrl", {
			$scope : $scope,
			$rootScope : $rootScope,
			$location : $location,
			orderService : orderService,
			cartService : cartService
		});
	}

	describe('on init', function(){

		it("puts the user's info to scope if available", function(){
			var user = {
				firstName : 'Test',
				lastName : 'User',
				streetAddress : 'Street',
				postalCode : '0000',
				city : 'City'
			};
			$rootScope.user = user;
			
			getController();

			expect($scope.info).toEqual(user);
		});

	});

	describe('submitOrder', function(){

		it('creates an order and clears cart', function(){
			var user = {
				firstName : 'Test',
				lastName : 'User',
				streetAddress : 'Street',
				postalCode : '0000',
				city : 'City'
			};
			$scope.info = user;
			orderService.create = sinon.stub().returns({
				then : sinon.stub().callsArg(0)
			});
			cartService.clearCart = sinon.spy();
			getController();

			$scope.submitOrder();

			expect(orderService.create).toHaveBeenCalledWith(user);
			expect(cartService.clearCart).toHaveBeenCalledOnce;
			expect($scope.orderDone).toEqual(true);
		});

	});

});