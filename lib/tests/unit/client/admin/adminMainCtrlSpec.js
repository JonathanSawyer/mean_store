/* jshint expr: true */
describe('adminMainCtrl', function(){
	var $controller, $rootScope, $scope, $location, $q;
	var ctrl, prodSvc, orderSvc, tabSvc;
	var DEFAULT_TAB = 'products';

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
		tabSvc     = {
			get : sinon.stub().returns(DEFAULT_TAB)
		};
	});

	//$rootScope, $location, $scope, productService, orderService,
	// selectedTabService
	function initController(){
		ctrl = $controller('adminMainCtrl', {
			$rootScope : $rootScope,
			$scope : $scope,
			$location : $location,
			productService : prodSvc,
			orderService : orderSvc,
			selectedTabService : tabSvc
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

		it('gets current tab from service', function(){
			expect($scope.currentTab).toEqual(DEFAULT_TAB);
		});

		describe("createProduct()", function(){

			it('changes location to editor', function(){
				$location.path = sinon.spy();

				$scope.createProduct();

				expect($location.path).toHaveBeenCalledWith('/admin/products/new');
			});

		});

		describe('editProduct', function(){

			it('changes location to editor for product', function(){
				$location.path = sinon.spy();

				var product = { _id : 'a' };

				$scope.editProduct(product);

				expect($location.path).toHaveBeenCalledWith('/admin/products/a');
			});

		});

		describe('tabSelected', function(){

			beforeEach(function(){
				tabSvc.set = sinon.spy();
			});

			it('sets selected tab to service', function(){
				$scope.tabSelected('orders');

				expect(tabSvc.set).toHaveBeenCalledWith('orders');
			});

			it('sets current tab to scope', function(){
				$scope.tabSelected('orders');

				expect($scope.currentTab).toEqual('orders');
			});

			it('updates tabs', function(){
				$scope.updateTabs = sinon.spy();

				$scope.tabSelected('orders');

				expect($scope.updateTabs).toHaveBeenCalledOnce;
			});

		});

		describe('updateTabs', function(){

			it('sets active tab on scope', function(){
				$scope.currentTab = 'orders';

				$scope.updateTabs();

				expect($scope.active.products).toBe(false);
				expect($scope.active.orders).toBe(true);
			});

		});

		describe('viewOrder', function(){

			it('sets location to order view', function(){
				$location.path = sinon.spy();
				var order = { _id : 'b' };

				$scope.viewOrder(order);

				expect($location.path).toHaveBeenCalledWith('/admin/orders/b');
			});

		});

	});

});
