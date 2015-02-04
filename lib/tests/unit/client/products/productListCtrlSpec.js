describe("Product list controller", function(){
	var $scope, ctrl, $controller, $routeParams, productSvc;

	var products = [{name: "A"}, {name: "B"}];

	beforeEach(module("storeApp.products"));

	beforeEach(inject(function($rootScope, _$controller_){
		$scope = $rootScope.$new();
		$controller = _$controller_;
		productSvc = {
			getByCategory: sinon.stub().returns({
				then : sinon.stub().callsArgWith(0, {data : products})
			})
		};
		$routeParams = { category: "phones"};
	}));

	function getController(){
		//$scope, productService, $routeParams
		ctrl = $controller("productListCtrl", {
			$scope : $scope,
			productService: productSvc,
			$routeParams : $routeParams
		});
	}

	describe("on init", function(){

		it('sets category to scope', function(){
			getController();

			expect($scope.category).toEqual("phones");
		});

		it("gets items by route category", function(){
			getController();

			expect(productSvc.getByCategory).toHaveBeenCalledWith("phones");
			expect($scope.products).toEqual(products);
		});

	});
});