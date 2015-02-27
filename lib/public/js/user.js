(function(){
	"use strict";

	angular.module("storeApp.users", ['ngStorage'])
		.factory("userService", function($http, $localStorage, $q){
			var KEY_TOKEN = "reauthToken",
				KEY_EMAIL = "userEmail";
			return {
				login : function(user){
					return $http.post("/users/login", user).then(function(res){
						if(res.data && res.data.token && res.data.user){
							$localStorage.$reset({
								reauthToken : res.data.token,
								userEmail : res.data.user.email
							});
						}
						return res.data.user;
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
					delete $localStorage[KEY_TOKEN];
					delete $localStorage[KEY_EMAIL];

					return $http.get("/users/logout").then(function(res){
						return res.data;
					}, function(err){
						return $q.reject(err.status);
					});
				},
				checkauth : function(){
					return $http.get("/users/checkauth").then(function(res){
						if(res.data && res.data.auth){
							return res.data;
						}else{
							//Check if we have a stored reauth token
							var token = $localStorage[KEY_TOKEN];
							var email = $localStorage[KEY_EMAIL];
							if(!token || !email){
								return { auth : false };
							}else{
								return $http.post('/users/reauth', {
									email : email,
									token : token
								}).then(function(res){
									if(res.data && res.data.auth && res.data.token){
										$localStorage.$reset({
											reauthToken : res.data.token,
											userEmail : res.data.user.email
										});
										return {
											auth : true,
											user : res.data.user
										};
									}else{
										return { auth : false };
									}
								}, function(err){
									return $q.reject(err.status);
								});
							}
						}
					}, function(err){
						return $q.reject(err.status);
					});
				}
			};
		})
		.controller("loginCtrl", function($rootScope, $scope, $location,
										userService){
			$scope.login = function(user){
				$scope.err = {};
				userService.login(user).then(function(loggedInUser){
					$rootScope.user = loggedInUser;
					$location.path('/');
				}, function(err){
					if(401 === err){
						$scope.err = { invalidLogin : true };
					}
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
