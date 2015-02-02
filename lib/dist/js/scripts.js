(function(){
	"use strict";

	angular.module("storeApp.admin", ["ui.bootstrap", "storeApp.products", "storeApp.checkout"])
		.controller("adminMainCtrl", ["$rootScope", "$location", "$scope", "productService", "orderService", "selectedTabService", function($rootScope, $location, $scope, productService, orderService, selectedTabService){
			if(!$rootScope.user || $rootScope.user.role !== 'admin'){
				$location.path('/');
			}else{
				$scope.currentTab = selectedTabService.get();
				$scope.updateTabs = function(){
					$scope.active = {
						products : false,
						orders : false
					};
					$scope.active[$scope.currentTab] = true;
				};
				$scope.updateTabs();

				$scope.tabSelected = function(tab){
					selectedTabService.set(tab);
					$scope.currentTab = tab;
					$scope.updateTabs();
				};

				productService.getAll({deleted: true}).then(function(res){
					$scope.products = res.data;
				});

				$scope.editProduct = function(product){
					$location.path('/admin/products/' + product._id);
				};

				$scope.createProduct = function(){
					$location.path('/admin/products/new');
				};

				orderService.getAll().then(function(res){
					var orders = res.data;
					//Add totals to all of them
					orders.forEach(function(order){
						order.total = order.products.reduce(function(prev, cur){
							return prev + (cur.quantity * cur.price);
						}, 0);
					});
					$scope.orders = orders;
				});

				$scope.viewOrder = function(order){
					$location.path('/admin/orders/' + order._id);
				};
			}

		}])
		.controller("productEditCtrl", ["$scope", "$routeParams", "$location", "productService", function($scope, $routeParams, $location, productService){
			if($routeParams.id !== 'new'){
				$scope.mode = 'edit';
				productService.getById($routeParams.id).then(function(res){
					$scope.product = res.data;
				});
			}else{
				$scope.mode = 'create';
				$scope.product = {};
			}

			productService.getCategories().then(function(res){
				$scope.categories = res.data;
			});

			$scope.save = function(product){
				if($scope.mode === 'edit'){
					productService.update(product).then(function(){
						$location.path('/admin');
					});
				}else{
					productService.create(product).then(function(){
						$location.path('/admin');
					});
				}
				
			};

			$scope.remove = function(product){
				productService.remove(product).then(function(){
					$location.path('/admin');
				});
			};

			$scope.undelete = function(product){
				product.deleted = false;
				productService.update(product).then(function(){
					$location.path('/admin');
				});
			};
		}])
		.controller("orderViewCtrl", ["$scope", "$routeParams", "$location", "orderService", "productService", function($scope, $routeParams, $location, orderService, productService){
			orderService.getById($routeParams.id).then(function(res){
				var order = res.data;
				$scope.order = order;
				$scope.products = {};
				var total = 0;
				order.products.forEach(function(prod){
					total += prod.quantity * prod.price;

					productService.getById(prod.product).then(function(res){
						$scope.products[prod.product] = res.data;
					});
				});
				$scope.total = total;

			});

			$scope.setAsSent = function(){
				$scope.order.sent = true;
				orderService.update($scope.order).then(function(){
					$location.path('/admin');
				});
			};
		}])
		.factory('selectedTabService', function(){
			var selectedTab = 'products';
			return {
				get : function(){
					return selectedTab;
				},
				set : function(tab){
					selectedTab = tab;
				}
			};
		});
}());
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
		.controller("mainCtrl", ["$scope", "$location", "$rootScope", "$http", "productService", "cartService", "userService", function($scope, $location, $rootScope,
										$http, productService, cartService, 
										userService){
			$scope.categories = [];
			productService.getCategories().then(function(res){
				$scope.categories = res.data;
			});

			userService.checkauth().then(function(res){
				if(res.data.auth){
					$rootScope.user = res.data.user;
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
		}])
		.config(["$routeProvider", function($routeProvider){
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
		}])
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
(function(){
	"use strict";

	angular.module("storeApp.cart", ["ui.bootstrap"])
		.controller("cartCtrl", ["$scope", "cartService", "$modal", "$location", function($scope, cartService, $modal, $location){
			$scope.clearCart = function(){
				var modal = $modal.open({
					templateUrl: 'clearCartModal.html',
					controller: "clearCartCtrl",
					size: 'sm'
				});

				modal.result.then(function(){
					cartService.clearCart();
				});
			};

			$scope.cartHasItems = function(){
				var cart = cartService.getCart();
				return cart && cart.length > 0;
			};

			$scope.goToOrder = function(){
				$location.path('/checkout');
			};
		}])
		.controller("clearCartCtrl", ["$scope", "$modalInstance", function($scope, $modalInstance){
			$scope.ok = function(){
				$modalInstance.close();
			};

			$scope.cancel = function(){
				$modalInstance.dismiss();
			};
		}])
		.factory("cartService", function(){
			var cart = [];
			//TODO Add persistence

			// cart.push({
			// 	_id: '54b27fc1433b3c60146cef33',
			// 	name: 'Samsung notebook',
			// 	price: 800,
			// 	quantity: 2
			// });
			// cart.push({
			// 	_id: '54b27f9d433b3c60146cef32',
			// 	name: 'Galaxy S5',
			// 	price: 350,
			// 	quantity: 1
			// });

			function findInCart(id){
				for (var i = 0; i < cart.length; i++) {
					if(cart[i]._id === id){
						return cart[i];
					}
				}
				return null;
			}

			return {
				addToCart : function(prod){
					var existing = findInCart(prod._id);
					if(existing){
						existing.quantity++;
					}else{
						prod.quantity = 1;
						cart.push(prod);
					}
				},
				getCart : function(){
					return cart;
				},
				incrementQuantity : function(item){
					var existing = findInCart(item._id);
					if(existing){
						existing.quantity++;
					}
				},
				decrementQuantity : function(item){
					var existing = findInCart(item._id);
					if(existing && existing.quantity > 1){
						existing.quantity--;
					}
				},
				removeItem : function(item){
					for (var i = 0; i < cart.length; i++) {
						if(cart[i]._id === item._id){
							cart.splice(i, 1);
							break;
						}
					}
				},
				clearCart : function(){
					cart = [];
				}
			};
		})
		.directive("cartIndicator", ["cartService", function(cartService){
			return {
				restrict: 'E',
				replace: true,
				scope: {},
				template: '<a href="#/cart">{{cartCount()}} items in cart : {{cartPrice() | currency}}</a>',
				link : function(scope, elem, attrs){
					scope.cartCount = function(){
						var cart = cartService.getCart();
						var amount = cart.reduce(function(prev, cur){
							return prev + cur.quantity;
						}, 0);
						return amount;
					};					

					scope.cartPrice = function(){
						var cart = cartService.getCart();
						
						var total = cart.reduce(function(prev, cur){
							return prev + (cur.quantity * cur.price);
						}, 0);
						return total;
					};
				}
			};
		}])
		.directive("cartTable", ["cartService", function(cartService){
			return {
				restrict: 'E',
				templateUrl: 'partials/cartTable.html',
				replace: false,
				scope: {},
				link : function(scope, elem, attrs){
					scope.getCart = function(){
						return cartService.getCart();
					};

					scope.increment = function(item){
						cartService.incrementQuantity(item);
					};

					scope.decrement = function(item){
						cartService.decrementQuantity(item);
					};

					scope.remove = function(item){
						cartService.removeItem(item);
					};

					scope.cartPrice = function(){
						var cart = cartService.getCart();
						var total = cart.reduce(function(prev, cur){
							return prev + (cur.quantity * cur.price);
						}, 0);
						return total;
					};
				}
			};
		}]);

}());
(function(){
	"use strict";

	angular.module('storeApp.checkout', ["storeApp.cart"])
		.controller("checkoutCtrl", ["$scope", "$rootScope", "$location", "orderService", "cartService", function($scope, $rootScope, $location, orderService, cartService){
			if($rootScope.user){
				var user = $rootScope.user;
				$scope.info = {
					firstName : user.firstName,
					lastName : user.lastName,
					streetAddress : user.streetAddress,
					postalCode : user.postalCode,
					city : user.city
				};
			}

			$scope.submitOrder = function(){
				orderService.create($scope.info).then(function(){
					cartService.clearCart();
					$scope.orderDone = true;
				});
			};

			$scope.backToCart = function(){
				$location.path('/cart');
			};

			$scope.backToFront = function(){
				$location.path('/');
			};
		}])
		.factory('orderService', ["$http", "cartService", function($http, cartService){
			return {
				create : function(userInfo){
					var cart = cartService.getCart();
					
					var order = {
						receiver: userInfo,
						products: []
					};

					cart.forEach(function(item){
						order.products.push({
							product : item._id,
							quantity : item.quantity,
							price : item.price
						});
					});

					return $http.post('/orders', order);
				},
				getAll : function(){
					return $http.get('/orders');
				},
				getById : function(id){
					return $http.get('/orders/' + id);
				},
				update : function(order){
					return $http.put('/orders/' + order._id, order);
				}
			};
		}]);

}());
(function(){
	"use strict";

	angular.module("storeApp.frontPage", [])
		.controller("frontpageCtrl", function(){
			
		});
}());
(function(){
	"use strict";

	var module = angular.module("storeApp.products", ["ngRoute"])
		.controller("productListCtrl", ["$scope", "productService", "$routeParams", function($scope, productService, $routeParams){
			$scope.category = $routeParams.category;

			productService.getByCategory($routeParams.category).then(function(res){
				$scope.products = res.data;
			});
		}])
		.controller("productViewCtrl", ["$scope", "$routeParams", "productService", function($scope, $routeParams, productService){
			var id = $routeParams.productId;
			
			productService.getById(id).then(function(res){
				$scope.product = res.data;
			});
		}])
		.factory("productService", ["$http", function($http){
			return {
				getCategories : function(){
					return $http.get("/products/categories");
				},
				getAll : function(opts){
					var url = "/products";
					if(opts && opts.deleted){
						url = url + "?deleted=true";
					}
					return $http.get(url);
				},
				getByCategory : function(category){
					return $http.get("/products/search?category=" + category);
				},
				getById : function(id){
					return $http.get("/products/" + id);
				},
				find : function(searchText){
					return $http.get("/products/search?name=" + searchText);
				},
				update : function(product){
					return $http.put("/products/" + product._id, product);
				},
				remove : function(product){
					return $http.delete("/products/" + product._id);
				},
				create : function(product){
					return $http.post('/products', product);
				}
			};
		}]);
}());
(function(){
	"use strict";

	angular.module("storeApp.search", ["storeApp.products"])
		.controller("searchCtrl", ["$routeParams", "$scope", "productService", function($routeParams, $scope, productService){
			$scope.query = $routeParams.query;

			productService.find($scope.query).then(function(res){
				$scope.products = res.data;
			});
		}]);
}());
(function(){
	"use strict";

	angular.module("storeApp.users", [])
		.factory("userService", ["$http", function($http){
			return {
				login : function(user){
					return $http.post("/users/login", user);
				},
				signup : function(user){
					return $http.post("/users/signup", user);
				},
				logout : function(){
					return $http.get("/users/logout");
				},
				checkauth : function(){
					return $http.get("/users/checkauth");
				}
			};
		}])
		.controller("loginCtrl", ["$rootScope", "$scope", "$location", "userService", function($rootScope, $scope, $location,
										userService){
			$scope.login = function(user){
				userService.login(user).then(function(res){
					$rootScope.user = res.data;
					$location.path('/');
				});
			};
		}])
		.controller("signupCtrl", ["$rootScope", "$scope", "$location", "userService", function($rootScope, $scope, $location,
											userService){
			$scope.signup = function(user){
				userService.signup(user).then(function(res){
					$rootScope.user = res.data;
					$location.path('/');
				});
			};
		}]);


}());