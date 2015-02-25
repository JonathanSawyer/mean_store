describe("Product list controller", function(){
	var $scope, $rootScope, productSvc;

	var products = [{name: "A"}, {name: "B"}];

	beforeEach(module("storeApp.products"));

	beforeEach(inject(function(_$rootScope_, $q, $controller){
		$rootScope = _$rootScope_;
		$scope = $rootScope.$new();

		var defer = $q.defer();
		defer.resolve(products);
		productSvc = {
			getByCategory: sinon.stub().returns(defer.promise)
		};

		var $routeParams = { category: "phones"};

		//$scope, productService, $routeParams
		$controller("productListCtrl", {
			$scope : $scope,
			productService: productSvc,
			$routeParams : $routeParams
		});
	}));

	describe("on init", function(){

		it('sets category to scope', function(){
			expect($scope.category).toEqual("phones");
		});

		it("gets items by route category", function(){
			expect(productSvc.getByCategory).toHaveBeenCalledWith("phones");
			$rootScope.$apply();
			expect($scope.products).toEqual(products);
		});

	});
});
