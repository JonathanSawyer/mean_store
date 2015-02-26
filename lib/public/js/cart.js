(function(){
	"use strict";

	angular.module("storeApp.cart", ["ui.bootstrap"])
		.controller("cartCtrl", function($scope, cartService, $modal, $location){
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
		})
		.controller("clearCartCtrl", function($scope, $modalInstance){
			$scope.ok = function(){
				$modalInstance.close();
			};

			$scope.cancel = function(){
				$modalInstance.dismiss();
			};
		})
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
				var results = cart.filter(function(item){
					return item._id === id;
				});
				if(results.length > 0){
					return results[0];
				}else{
					return null;
				}
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
		.directive("cartIndicator", function(cartService){
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
		})
		.directive("cartTable", function(cartService){
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
		});

}());
