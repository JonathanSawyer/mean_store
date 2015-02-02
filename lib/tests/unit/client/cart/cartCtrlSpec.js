/* jshint expr: true */
describe("cartCtrl", function(){
	var ctrl, $scope, $controller, cartService, $location, $modal;

	beforeEach(module("storeApp.cart"));

	//Controller deps
	//$scope, cartService, $modal, $location
	beforeEach(inject(function(_$controller_){
		$scope = {};
		$modal = {};
		$controller = _$controller_;
	}));

	function getController(){
		ctrl = $controller("cartCtrl", {
			$scope : $scope,
			cartService : cartService,
			$modal : $modal,
			$location : $location
		});
	}

	describe("cartHasItems", function(){

		it("returns true when cart has items", function(){
			var getCart = sinon.stub();
			getCart.returns([{
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
			}]);
			cartService = {
				getCart : getCart
			};

			getController();

			expect($scope.cartHasItems()).toEqual(true);
		});

		it('returns false when no items', function(){
			var getCart = sinon.stub();
			getCart.returns([]);
			cartService = {
				getCart : getCart
			};

			getController();

			expect($scope.cartHasItems()).toEqual(false);
		});

	});

	describe("clearCart", function(){

		it("opens modal and on success clears cart", function(){
			$modal.open = sinon.stub();
			var modal = {
				result : { then : sinon.stub() }
			};
			modal.result.then.callsArg(0);
			$modal.open.returns(modal);
			cartService.clearCart = sinon.spy();
			getController();

			$scope.clearCart();

			expect($modal.open).toHaveBeenCalledOnce;
			cartService.clearCart.toHaveBeenCalledOnce;
		});

	});

});