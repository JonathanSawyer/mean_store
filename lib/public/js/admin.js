(function(){
	"use strict";

	angular.module("storeApp.admin", ["ui.bootstrap", "storeApp.products", "storeApp.checkout"])
		.controller("adminMainCtrl", function($rootScope, $location, $scope, productService, orderService, selectedTabService){
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

				productService.getAll({deleted: true}).then(function(products){
					$scope.products = products;
				});

				$scope.editProduct = function(product){
					$location.path('/admin/products/' + product._id);
				};

				$scope.createProduct = function(){
					$location.path('/admin/products/new');
				};

				orderService.getAll().then(function(orders){
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

		})
		.controller("productEditCtrl", function($scope, $routeParams, $location, productService){
			if($routeParams.id !== 'new'){
				$scope.mode = 'edit';
				productService.getById($routeParams.id).then(function(product){
					$scope.product = product;
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
		})
		.controller("orderViewCtrl", function($scope, $routeParams, $location, orderService, productService){
			orderService.getById($routeParams.id).then(function(order){
				$scope.order = order;
				$scope.products = {};
				var total = 0;
				order.products.forEach(function(prod){
					total += prod.quantity * prod.price;

					productService.getById(prod.product).then(function(product){
						$scope.products[prod.product] = product;
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
		})
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