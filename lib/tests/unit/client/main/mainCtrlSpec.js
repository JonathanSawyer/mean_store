describe('Main controller', function(){
	var $scope, $rootScope, ctrl, $controller, $location, productSvc, userSvc, cartSvc;

	beforeEach(module("storeApp"));

	beforeEach(inject(function(_$rootScope_, _$controller_){
		$rootScope = _$rootScope_;
		$scope = $rootScope.$new();
		$controller = _$controller_;
		productSvc = {
			getCategories: sinon.stub().returns({
				then : sinon.stub().callsArgWith(0, ["phones", "computers"])
			})
		};
		userSvc = {
			checkauth : function(){
				return {
					then : function(){}
				};
			}
		};
	}));

	function getController(){
		//$scope, $location, $rootScope,
		//productService, cartService, 
		//userService
		ctrl = $controller("mainCtrl", {
			$scope : $scope,
			$location : $location,
			$rootScope : $rootScope,
			productService: productSvc,
			userService : userSvc,
			cartService : cartSvc
		});
	}

	describe("when initialized", function(){

		it("gets categories", function(){
			var categories = ["phones, computers"];
			productSvc.getCategories = sinon.stub().returns({
				then: sinon.stub().callsArgWith(0, categories)
			});

			getController();

			expect($scope.categories).toEqual(categories);
		});

	});

	describe("log out", function(){

		it('erases user from scope', function(){
			userSvc.logout = sinon.spy();
			getController();

			$scope.logout();

			expect($rootScope.user).toBeNull();
			expect(userSvc.logout).toHaveBeenCalled();
		});

	});

	describe("search", function(){

		it("sends the user to search page", function(){
			$location = {
				path : sinon.stub()
			};
			var spy = {search: sinon.spy()};
			$location.path.returns(spy);
			$scope.searchText = 'football';
			getController();

			$scope.search();

			expect($location.path).toHaveBeenCalledWith('/search');
			expect(spy.search).toHaveBeenCalledWith('query', 'football');
			expect($scope.searchText).toEqual('');
		});

	});

});