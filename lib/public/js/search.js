(function(){
	"use strict";

	angular.module("storeApp.search", ["storeApp.products"])
		.controller("searchCtrl", function($routeParams, $scope, productService){
			$scope.query = $routeParams.query;

			productService.find($scope.query).then(function(res){
				$scope.products = res.data;
			});
		});
}());