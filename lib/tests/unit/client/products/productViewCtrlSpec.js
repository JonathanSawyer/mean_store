describe("productViewCtrl", function(){
	var $scope, ctrl, $controller, $routeParams, productSvc;

	var products = [{_id: "a", name: "A"}, {_id: "b", name: "B"}];

	beforeEach(module("storeApp.products"));

	beforeEach(inject(function($rootScope, _$controller_){
		$scope = $rootScope.$new();
		$controller = _$controller_;
		var getById = sinon.stub();
		getById.withArgs(products[0]._id).returns({
			then : sinon.stub().callsArgWith(0, products[0])
		});

		productSvc = {
			getById: getById
		};
		$routeParams = { productId: products[0]._id};
	}));

	function getController(){
		//$scope, $routeParams, productService
		ctrl = $controller("productViewCtrl", {
			$scope : $scope,
			$routeParams : $routeParams,
			productService: productSvc
		});
	}

	describe("on init", function(){

		it("gets items by id", function(){
			getController();

			expect($scope.product).toEqual(products[0]);
		});

	});
});