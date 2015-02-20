describe("User controller", function(){
  var ctrl, $rootScope, $scope, $location, userService;

  beforeEach(module("storeApp.users"));

  beforeEach(inject(function($controller){
    $rootScope = {};
    $scope = {};
    $location = {};
    userService = {};
    //$rootScope, $scope, $location, userService
    ctrl = $controller("loginCtrl", {
      $rootScope : $rootScope,
      $scope : $scope,
      $location : $location,
      userService : userService
    });
  }));

  it('sets an error if login fails', function(){
    userService.login = sinon.stub().returns({
      then : sinon.stub().callsArgWith(1, 401)
    });

    $scope.login({email : 'aa@aa.com', password: 'a'});

    expect($scope.err).toBeTruthy();
    expect($scope.err.invalidLogin).toBeTruthy();
  });

  it('sets user to root scope on successful login', function(){
    var user = {email : 'aa@aa.com', password : 'pass'};
    userService.login = sinon.stub().returns({
      then : sinon.stub().callsArgWith(0, user)
    });
    $location.path = sinon.spy();

    $scope.login(user);

    expect($rootScope.user).toEqual(user);
    expect($location.path).toHaveBeenCalledWith('/');
  });

});
