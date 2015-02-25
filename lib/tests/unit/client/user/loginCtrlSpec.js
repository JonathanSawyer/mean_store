describe("User controller", function(){
  var $rootScope, $scope, $location, userService, loginDefer;

  beforeEach(module("storeApp.users"));

  beforeEach(inject(function(_$rootScope_, $controller, $q){
    $rootScope = _$rootScope_;
    $scope = {};
    $location = {};
    userService = {};

    loginDefer = $q.defer();
    userService.login = sinon.stub().returns(loginDefer.promise);

    //$rootScope, $scope, $location, userService
    $controller("loginCtrl", {
      $rootScope : $rootScope,
      $scope : $scope,
      $location : $location,
      userService : userService
    });
  }));

  it('sets an error if login fails', function(){
    loginDefer.reject(401);

    $scope.login({email : 'aa@aa.com', password: 'a'});
    $rootScope.$apply();

    expect($scope.err).toBeTruthy();
    expect($scope.err.invalidLogin).toBeTruthy();
  });

  it('sets user to root scope on successful login', function(){
    var user = {email : 'aa@aa.com', password : 'pass'};
    loginDefer.resolve(user);

    $location.path = sinon.spy();

    $scope.login(user);
    $rootScope.$apply();

    expect($rootScope.user).toEqual(user);
    expect($location.path).toHaveBeenCalledWith('/');
  });

});
