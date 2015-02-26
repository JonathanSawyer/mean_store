describe('orderViewCtrl', function(){
	var $controller, $scope, $routeParams, $location, $rootScope, $q;
	var orderSvc, prodSvc;

	var ORDER = {
		_id : 'a',
		products : [
		{
			product : 'aa',
			quantity : 1,
			price : 10
		},
		{
			product : 'bb',
			quantity : 2,
			price : 20
		}
		]
	};
	var PRODUCTS = {
		aa : {
			_id : 'aa',
			name : 'Product A'
		},
		bb: {
			_id : 'bb',
			name : 'Product B'
		}
	};

	beforeEach(module('storeApp.admin'));

	beforeEach(inject(function($controller, _$rootScope_, _$q_){
		$rootScope = _$rootScope_;
		$q = _$q_;

		$scope = {};
		$routeParams = {};
		$location = {};
		prodSvc = {};
		orderSvc = {};

		$routeParams.id = ORDER._id;
		var orderDefer = $q.defer();
		orderDefer.resolve(ORDER);
		orderSvc.getById = sinon.stub().returns(orderDefer.promise);

		var prodADefer = $q.defer();
		prodADefer.resolve(PRODUCTS.aa);
		var prodBDefer = $q.defer();
		prodBDefer.resolve(PRODUCTS.bb);

		prodSvc.getById = sinon.stub();
		prodSvc.getById.withArgs('aa').returns(prodADefer.promise);
		prodSvc.getById.withArgs('bb').returns(prodBDefer.promise);

		//$scope, $routeParams, $location, orderService, productService
		$controller("orderViewCtrl", {
			$scope : $scope,
			$routeParams : $routeParams,
			$location : $location,
			orderService : orderSvc,
			productService : prodSvc
		});
		$rootScope.$apply();
	}));

	describe('on init', function(){

		it('gets the order', function(){
			expect($scope.order).toEqual(ORDER);
		});

		it('calculates the total', function(){
			expect($scope.total).toEqual(50);
		});

		it('gets the products assigned to the order', function(){
			expect($scope.products).toEqual(PRODUCTS);
		});

	});

	describe('setAsSent', function(){
		var updateDefer;

		beforeEach(function(){
			updateDefer = $q.defer();
			orderSvc.update = sinon.stub().returns(updateDefer.promise);
		});

		it('sets the order as sent', function(){
			$scope.setAsSent();

			expect($scope.order.sent).toBe(true);
		});

		it('updates the order', function(){
			$location.path = sinon.spy();

			$scope.setAsSent();
			updateDefer.resolve();
			$rootScope.$apply();

			expect($location.path).toHaveBeenCalledWith('/admin');
			expect(orderSvc.update).toHaveBeenCalledWith($scope.order);
		});

	});

});
