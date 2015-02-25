describe("productViewCtrl", function(){
	var $scope, $routeParams, $rootScope, productSvc;

	var PRODUCT = {_id: "a", name: "A"};

	beforeEach(module("storeApp.products"));

	beforeEach(inject(function(_$rootScope_, $q, $controller){
		$rootScope = _$rootScope_;
		$scope = $rootScope.$new();
		var defer = $q.defer();
		defer.resolve(PRODUCT);

		productSvc = {
			getById: sinon.stub().withArgs(PRODUCT._id).returns(defer.promise)
		};

		$routeParams = { productId: PRODUCT._id};

		//$scope, $routeParams, productService
		$controller("productViewCtrl", {
			$scope : $scope,
			$routeParams : $routeParams,
			productService: productSvc
		});
	}));

	describe("on init", function(){

		it("gets items by id", function(){
			$rootScope.$apply();
			expect($scope.product).toEqual(PRODUCT);
		});

	});
});
