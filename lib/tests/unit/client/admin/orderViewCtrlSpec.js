describe('orderViewCtrl', function(){
	var $controller, $scope, $routeParams, $location, $rootScope, $q;
	var ctrl, orderSvc, prodSvc;
	var orderId = 'a';

	beforeEach(function(){
		module('storeApp.admin');

		inject(function(_$controller_, _$rootScope_, _$q_){
			$controller = _$controller_;
			$rootScope = _$rootScope_;
			$q = _$q_;
		});

		$scope = {};
		$routeParams = {};
		$location = {};
		prodSvc = {};
		orderSvc = {};
	});

	//$scope, $routeParams, $location, orderService, productService
	function getController(){
		ctrl = $controller("orderViewCtrl", {
			$scope : $scope,
			$routeParams : $routeParams,
			$location : $location,
			orderService : orderSvc,
			productService : prodSvc
		});
	}

	describe('on init', function(){

		var order = {
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
		var products = {
			aa : {
				_id : 'aa',
				name : 'Product A'
			},
			bb: {
				_id : 'bb',
				name : 'Product B'
			}
		};

		beforeEach(function(){
			$routeParams.id = order._id;
			var orderDefer = $q.defer();
			orderDefer.resolve(order);
			orderSvc.getById = sinon.stub().returns(orderDefer.promise);

			var prodADefer = $q.defer();
			prodADefer.resolve(products.aa);
			var prodBDefer = $q.defer();
			prodBDefer.resolve(products.bb);

			prodSvc.getById = sinon.stub();
			prodSvc.getById.withArgs('aa').returns(prodADefer.promise);
			prodSvc.getById.withArgs('bb').returns(prodBDefer.promise);
		});

		it('gets the order', function(){
			getController();
			$rootScope.$apply();

			expect($scope.order).toEqual(order);
		});

		it('calculates the total', function(){
			getController();
			$rootScope.$apply();

			expect($scope.total).toEqual(50);
		});

		it('gets the products assigned to the order', function(){
			getController();
			$rootScope.$apply();

			expect($scope.products).toEqual(products);
		});

	});

});
