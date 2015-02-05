(function(){
	"use strict";

	angular.module('storeApp.checkout', ["storeApp.cart"])
		.controller("checkoutCtrl", function($scope, $rootScope, $location, orderService, cartService){
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
		})
		.factory('orderService', function($http, $q, cartService){
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

					return $http.post('/orders', order).then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				},
				getAll : function(){
					return $http.get('/orders').then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				},
				getById : function(id){
					return $http.get('/orders/' + id).then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				},
				update : function(order){
					return $http.put('/orders/' + order._id, order).then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				}
			};
		});

}());