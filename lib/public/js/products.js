(function(){
	"use strict";

	var module = angular.module("storeApp.products", ["ngRoute"])
		.controller("productListCtrl", function($scope, productService, $routeParams){
			$scope.category = $routeParams.category;

			productService.getByCategory($routeParams.category).then(function(products){
				$scope.products = products;
			});
		})
		.controller("productViewCtrl", function($scope, $routeParams, productService){
			var id = $routeParams.productId;
			
			productService.getById(id).then(function(product){
				$scope.product = product;
			});
		})
		.factory("productService", function($http, $q){
			return {
				getCategories : function(){
					return $http.get("/products/categories").then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				},
				getAll : function(opts){
					var url = "/products";
					if(opts && opts.deleted){
						url = url + "?deleted=true";
					}
					return $http.get(url).then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				},
				getByCategory : function(category){
					return $http.get("/products/search?category=" + category).then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				},
				getById : function(id){
					return $http.get("/products/" + id).then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				},
				find : function(searchText){
					return $http.get("/products/search?name=" + searchText).then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				},
				update : function(product){
					return $http.put("/products/" + product._id, product).then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				},
				remove : function(product){
					return $http.delete("/products/" + product._id).then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				},
				create : function(product){
					return $http.post('/products', product).then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				}
			};
		});
}());