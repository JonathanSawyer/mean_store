/* jshint expr: true */
describe('Main controller', function(){
	var $scope, $rootScope, $q, $controller, $location, productSvc, userSvc, cartSvc;
	var CATEGORIES = ["phones", "computers"];
	var checkAuthDefer;

	beforeEach(module("storeApp"));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_){
		$rootScope = _$rootScope_;
		$q = _$q_;
		$scope = $rootScope.$new();
		$controller = _$controller_;
		$location= {};
		cartSvc = {};

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

	describe('findProducts', function(){
		var PRODUCTS = [{name : 'aa'}, {name: 'ab'}, {name : 'bb'}];

		it('returns the names of products matching a search', function(){
			var defer = $q.defer();
			productSvc.find = sinon.stub().returns(defer.promise);

			var names;
			$scope.findProducts('a').then(function(_names){
				names = _names;
			});
			defer.resolve([{name : 'aa'}, {name : 'ab'}]);
			$rootScope.$apply();

			expect(names).toEqual(['aa', 'ab']);
		});

	});

	describe('typeAheadSelected', function(){
		it('calls search', function(){
			$scope.search = sinon.spy();

			$scope.typeAheadSelected();

			expect($scope.search).toHaveBeenCalledOnce;
		});
	});

	describe('addToCart', function(){

		it('calls cart service', function(){
			var PRODUCT = {_id : 'a', name : 'aaa' };
			cartSvc.addToCart = sinon.spy();

			$scope.addToCart(PRODUCT);

			expect(cartSvc.addToCart).toHaveBeenCalledWith(PRODUCT);
		});

	});

});
