/* jshint expr: true */
describe('adminMainCtrl', function(){
	var $controller, $rootScope, $scope, $location;
	var ctrl, prodSvc, orderSvc;

	beforeEach(function(){
		module('storeApp.admin');

		inject(function(_$controller_){
			$controller = _$controller_;
		});

		$rootScope = {};
		$scope     = {};
		$location  = {};
		prodSvc    = {};
		orderSvc   = {};
	});

	//$rootScope, $location, $scope, productService, orderService
	function getController(){
		ctrl = $controller('adminMainCtrl', {
			$rootScope : $rootScope,
			$scope : $scope,
			$location : $location,
			productService : prodSvc,
			orderService : orderSvc
		});
	}

	describe('on init with invalid user', function(){

		it('redirects if user not logged in', function(){
			$location.path = sinon.spy();

			getController();

			expect($location.path).toHaveBeenCalledWith('/');
		});

		it('redirects if user is not admin', function(){
			$rootScope.user = { role : 'customer' };
			$location.path = sinon.spy();

			getController();

			expect($location.path).toHaveBeenCalledWith('/');
		});

	});

	describe('on init with valid user', function(){
		var orders = [
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
		var products = [
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
			prodSvc.getAll = sinon.stub().returns({
				then : sinon.stub().callsArgWith(0, products)
			});

			orderSvc.getAll = sinon.stub().returns({
				then : sinon.stub().callsArgWith(0, orders)
			});

		});

		it('gets all products', function(){
			getController();

			expect($scope.products).toEqual(products);
		});

		it('gets all orders', function(){
			getController();

			expect($scope.orders).toEqual(orders);
		});

	});

});