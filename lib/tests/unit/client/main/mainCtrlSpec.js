describe('MainCtrl', function(){
	var $scope, $rootScope, ctrl, $controller, $location, productSvc, userSvc, cartSvc;

	beforeEach(module("storeApp"));

	beforeEach(inject(function(_$rootScope_, _$controller_){
		$rootScope = _$rootScope_;
		$scope = $rootScope.$new();
		$controller = _$controller_;
		productSvc = {
			getCategories: function(){
				return {
					then: function(done){
						done(["phones, computers"]);
					}
				};
			}
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

	describe("on initialization", function(){

		it("gets categories", function(){
			var getCategories = sinon.stub();
			productSvc.getCategories = getCategories;
			var res = { data : ["phones, computers"]};
			getCategories.returns({
				then: function(done){
					done(res);
				}
			});

			getController();

			expect(getCategories).toHaveBeenCalled();
			expect($scope.categories).toEqual(res.data);
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