(function(){
	'use strict';

	var app = angular.module("storeApp", [
										"ngRoute",
										"ui.bootstrap",
										"storeApp.frontPage",
										"storeApp.products",
										"storeApp.cart",
										"storeApp.users",
										"storeApp.search",
										"storeApp.admin",
										"storeApp.checkout"
										])
		.controller("mainCtrl", function($scope, $location, $rootScope,
										$http, productService, cartService, 
										userService){
			$scope.categories = [];
			productService.getCategories().then(function(categories){
				$scope.categories = categories;
			});

			userService.checkauth().then(function(data){
				if(data.auth){
					$rootScope.user = data.user;
				}
			});

			$scope.logout = function(){
				$rootScope.user = null;
				userService.logout();
			};

			$scope.search = function(){
				var text = $scope.searchText;
				$scope.searchText = '';
				$location.path('/search').search('query', text);
			};

			$scope.findProducts = function(val){
				return $http.get("/products/search?name=" + val)
					.then(function(res){
						return res.data.map(function(prod){
							return prod.name;
						});
					});
			};

			$scope.typeAheadSelected = function(){
				$scope.search();
			};

			$scope.addToCart = function(product){
				cartService.addToCart(product);
			};
		})
		.config(function($routeProvider){
			$routeProvider
				.when('/', {
					templateUrl: 'partials/frontpage.html',
					controller: 'frontpageCtrl'
				})
				.when('/products/:category', {
					templateUrl: 'partials/productList.html',
					controller: 'productListCtrl'
				})
				.when('/products/:category/:productId', {
					templateUrl: 'partials/productView.html',
					controller: 'productViewCtrl'
				})
				.when('/cart', {
					templateUrl: 'partials/cart.html',
					controller: 'cartCtrl'
				})
				.when('/login', {
					templateUrl: 'partials/login.html',
					controller: 'loginCtrl'
				})
				.when('/signup', {
					templateUrl: 'partials/signup.html',
					controller: 'signupCtrl'
				})
				.when('/search', {
					templateUrl: 'partials/search.html',
					controller: 'searchCtrl'
				})
				.when('/admin', {
					templateUrl: 'partials/adminMain.html',
					controller: 'adminMainCtrl'
				})
				.when('/admin/products/:id', {
					templateUrl: 'partials/adminProductEdit.html',
					controller: 'productEditCtrl'
				})
				.when('/admin/orders/:id', {
					templateUrl: 'partials/adminOrderView.html',
					controller: 'orderViewCtrl'
				})
				.when('/checkout', {
					templateUrl: 'partials/checkout.html',
					controller: 'checkoutCtrl'
				});
		})
		.filter("capitalize", function(){
			return function(input){
				if(input){
					input = input.toUpperCase();
					if(input.length > 1){
						input = input.substring(0, 1) + input.substring(1).toLowerCase();
					}
					return input;
				}
			};
		});
}());