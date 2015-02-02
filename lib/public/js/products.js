(function(){
	"use strict";

	var module = angular.module("storeApp.products", ["ngRoute"])
		.controller("productListCtrl", function($scope, productService, $routeParams){
			$scope.category = $routeParams.category;

			productService.getByCategory($routeParams.category).then(function(res){
				$scope.products = res.data;
			});
		})
		.controller("productViewCtrl", function($scope, $routeParams, productService){
			var id = $routeParams.productId;
			
			productService.getById(id).then(function(res){
				$scope.product = res.data;
			});
		})
		.factory("productService", function($http){
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
		});
}());