(function(){
	"use strict";

	angular.module("storeApp.users", [])
		.factory("userService", function($http){
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
		})
		.controller("loginCtrl", function($rootScope, $scope, $location,
										userService){
			$scope.login = function(user){
				userService.login(user).then(function(res){
					$rootScope.user = res.data;
					$location.path('/');
				});
			};
		})
		.controller("signupCtrl", function($rootScope, $scope, $location,
											userService){
			$scope.signup = function(user){
				userService.signup(user).then(function(res){
					$rootScope.user = res.data;
					$location.path('/');
				});
			};
		});


}());