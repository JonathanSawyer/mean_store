/* jshint expr: true */
describe("Cart controller", function(){
	var ctrl, $scope, $controller, cartService, $location, $modal, $rootScope, $q;

	beforeEach(module("storeApp.cart"));

	beforeEach(inject(function(_$controller_, _$rootScope_, _$q_){
		$scope = {};
		$modal = {};
		$controller = _$controller_;
		$rootScope = _$rootScope_;
		$q = _$q_;
	}));

	function initController(){
		//Controller deps
		//$scope, cartService, $modal, $location
		ctrl = $controller("cartCtrl", {
			$scope : $scope,
			cartService : cartService,
			$modal : $modal,
			$location : $location
		});
	}

	describe("cartHasItems()", function(){

		it("returns true when cart has items", function(){
			cartService = {
				getCart : sinon.stub().returns([{
					_id: '54b27fc1433b3c60146cef33',
					name: 'Samsung notebook',
					price: 800,
					quantity: 2
				},
				{
					_id: '54b27f9d433b3c60146cef32',
					name: 'Galaxy S5',
					price: 350,
					quantity: 1
				}])
			};

			initController();

			expect($scope.cartHasItems()).toEqual(true);
		});

		it('returns false when no items', function(){
			cartService = {
				getCart : sinon.stub().returns([])
			};

			initController();

			expect($scope.cartHasItems()).toEqual(false);
		});

	});

	describe("clearCart", function(){

		beforeEach(function(){
			var defer = $q.defer();
			defer.resolve();
			$modal.open = sinon.stub().returns({
				result : defer.promise
			});
		});

		it("opens modal and on success clears cart", function(){
			cartService.clearCart = sinon.spy();
			initController();
			$rootScope.$apply();

			$scope.clearCart();

			cartService.clearCart.toHaveBeenCalledOnce;
		});

	});

});
