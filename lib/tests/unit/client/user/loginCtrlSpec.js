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
    $scope.login({email : 'aa@aa.com', password: 'a'});
    loginDefer.reject(401);
    $rootScope.$apply();

    expect($scope.err).toBeTruthy();
    expect($scope.err.invalidLogin).toBeTruthy();
  });

  it('sets user to root scope on successful login', function(){
    var user = {email : 'aa@aa.com', password : 'pass'};

    $location.path = sinon.spy();

    $scope.login(user);
    loginDefer.resolve(user);
    $rootScope.$apply();

    expect($rootScope.user).toEqual(user);
    expect($location.path).toHaveBeenCalledWith('/');
  });

  it('erases login error when submitting', function(){
    var user = {email : 'aa@aa.com', password : 'pass'};
    $scope.err = {invalidLogin : true};

    $scope.login(user);

    expect($scope.err).toEqual({});
  });

});
