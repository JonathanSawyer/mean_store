/* jshint expr: true */
describe('Checkout controller', function(){
	var ctrl, orderService, cartService;
	var $controller, $scope, $rootScope, $location, $q;

	beforeEach(function(){
		module("storeApp.checkout");

		inject(function(_$controller_, _$rootScope_, _$q_){
			$controller = _$controller_;
			$rootScope = _$rootScope_;
			$q = _$q_;
		});

		$scope = {};
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
			var defer = $q.defer();
			defer.resolve();
			orderService.create = sinon.stub().returns(defer.promise);

			cartService.clearCart = sinon.spy();
			initController();
		});

		it('creates an order', function(){
			$scope.submitOrder();
			$rootScope.$apply();

			expect(orderService.create).toHaveBeenCalledWith(user);
			expect($scope.orderDone).toEqual(true);
		});

		it('clears the shopping cart', function(){
			$scope.submitOrder();
			$rootScope.$apply();

			expect(cartService.clearCart).toHaveBeenCalledOnce;
		});

	});

});
