/* jshint expr: true */
describe('adminMainCtrl', function(){
	var $controller, $rootScope, $scope, $location, $q;
	var ctrl, prodSvc, orderSvc;

	beforeEach(function(){
		module('storeApp.admin');

		inject(function(_$controller_, _$q_, _$rootScope_){
			$controller = _$controller_;
			$q = _$q_;
			$rootScope = _$rootScope_;
		});

		$scope     = {};
		$location  = {};
		prodSvc    = {};
		orderSvc   = {};
	});

	//$rootScope, $location, $scope, productService, orderService
	function initController(){
		ctrl = $controller('adminMainCtrl', {
			$rootScope : $rootScope,
			$scope : $scope,
			$location : $location,
			productService : prodSvc,
			orderService : orderSvc
		});
	}

	describe('on init with invalid user', function(){
		beforeEach(function(){
			$location.path = sinon.spy();
		});

		it('redirects if user not logged in', function(){
			initController();

			expect($location.path).toHaveBeenCalledWith('/');
		});

		it('redirects if user is not admin', function(){
			$rootScope.user = { role : 'customer' };

			initController();

			expect($location.path).toHaveBeenCalledWith('/');
		});

	});

	describe('on init with valid user', function(){
		var ORDERS = [
				{
					products : [
					{
						quantity : 2,
						product : 'a',
						price : 350
					},
					{
						product : 'b',
						quantity : 1,
						price : 500
					}
					]
				}
				];
		var PRODUCTS = [
				{
					_id : 'a',
					name : 'aa',
					price : 350
				},
				{
					_id : 'b',
					name : 'bb',
					price : 500
				}
				];


		beforeEach(function(){
			$rootScope.user = { role : 'admin' };

			var prodDefer = $q.defer();
			prodDefer.resolve(PRODUCTS);
			prodSvc.getAll = sinon.stub().returns(prodDefer.promise);

			var orderDefer = $q.defer();
			orderDefer.resolve(ORDERS);
			orderSvc.getAll = sinon.stub().returns(orderDefer.promise);

			initController();
			$rootScope.$apply();
		});

		it('gets all products', function(){
			expect($scope.products).toEqual(PRODUCTS);
		});

		it('gets all orders', function(){
			expect($scope.orders).toEqual(ORDERS);
		});

	});

});
