describe('Main controller', function(){
	var $scope, $rootScope, $controller, $location, productSvc, userSvc, cartSvc;
	var CATEGORIES = ["phones", "computers"];
	var checkAuthDefer;

	beforeEach(module("storeApp"));

	beforeEach(inject(function(_$rootScope_, _$controller_, $q){
		$rootScope = _$rootScope_;
		$scope = $rootScope.$new();
		$controller = _$controller_;
		$location= {};

		var defer = $q.defer();
		defer.resolve(CATEGORIES);
		productSvc = {
			getCategories: sinon.stub().returns(defer.promise)
		};

		checkAuthDefer = $q.defer();
		userSvc = {
			checkauth : sinon.stub().returns(checkAuthDefer.promise)
		};

		//$scope, $location, $rootScope,
		//productService, cartService,
		//userService
		$controller("mainCtrl", {
			$scope : $scope,
			$location : $location,
			$rootScope : $rootScope,
			productService: productSvc,
			userService : userSvc,
			cartService : cartSvc
		});
		$rootScope.$apply();
	}));

	describe("when initialized", function(){

		it("gets categories", function(){
			expect($scope.categories).toEqual(CATEGORIES);
		});

		describe("if user has active session", function(){

			it('sets user to rootScope', function(){
				var user = {
					name : 'aasdf'
				};
				checkAuthDefer.resolve({
					auth : true,
					user : user
				});

				$rootScope.$apply();

				expect($rootScope.user).toEqual(user);
			});

		});

		describe("if there is no active session", function(){

			it('does not set a user to rootScope', function(){
				checkAuthDefer.resolve({ auth : false });

				$rootScope.$apply();

				expect($rootScope.user).not.toBeTruthy();
			});

		});

	});

	describe("log out", function(){

		it('erases user from scope', function(){
			userSvc.logout = sinon.spy();

			$scope.logout();

			expect($rootScope.user).toBeNull();
			expect(userSvc.logout).toHaveBeenCalled();
		});

	});

	describe("search", function(){

		it("sends the user to search page", function(){
			var spy = {search: sinon.spy()};
			$location.path = sinon.stub().returns(spy);
			$scope.searchText = 'football';

			$scope.search();

			expect($location.path).toHaveBeenCalledWith('/search');
			expect(spy.search).toHaveBeenCalledWith('query', 'football');
			expect($scope.searchText).toEqual('');
		});

	});

});
