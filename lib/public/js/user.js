(function(){
	"use strict";

	angular.module("storeApp.users", [])
		.factory("userService", function($http){
			return {
				login : function(user){
					return $http.post("/users/login", user).then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				},
				signup : function(user){
					return $http.post("/users/signup", user).then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				},
				logout : function(){
					return $http.get("/users/logout").then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				},
				checkauth : function(){
					return $http.get("/users/checkauth").then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				}
			};
		})
		.controller("loginCtrl", function($rootScope, $scope, $location,
										userService){
			$scope.login = function(user){
				userService.login(user).then(function(loggedInUser){
					$rootScope.user = loggedInUser;
					$location.path('/');
				});
			};
		})
		.controller("signupCtrl", function($rootScope, $scope, $location,
											userService){
			$scope.signup = function(user){
				userService.signup(user).then(function(signedUpUser){
					$rootScope.user = signedUpUser;
					$location.path('/');
				});
			};
		});


}());