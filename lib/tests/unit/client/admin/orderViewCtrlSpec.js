describe('orderViewCtrl', function(){
	var $controller, $scope, $routeParams, $location;
	var ctrl, orderSvc, prodSvc;
	var orderId = 'a';

	beforeEach(function(){
		module('storeApp.admin');

		inject(function(_$controller_){
			$controller = _$controller_;
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
			orderSvc.getById = sinon.stub().returns({
				then : sinon.stub().callsArgWith(0, order)
			});
			
			prodSvc.getById = sinon.stub();
			prodSvc.getById.withArgs('aa').returns({
				then : sinon.stub().callsArgWith(0, products.aa)
			});
			prodSvc.getById.withArgs('bb').returns({
				then : sinon.stub().callsArgWith(0, products.bb)
			});
		});

		it('gets the order', function(){
			getController();

			expect($scope.order).toEqual(order);
		});

		it('calculates the total', function(){
			getController();

			expect($scope.total).toEqual(50);
		});

		it('gets the products assigned to the order', function(){
			getController();

			expect($scope.products).toEqual(products);
		});

	});

});