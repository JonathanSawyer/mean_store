/* jshint expr: true */
describe('clearCartCtrl', function(){
  var $scope, $modalInstance;

  beforeEach(module("storeApp.cart"));

  beforeEach(inject(function($controller, $rootScope){
    $scope = $rootScope.$new();
    $modalInstance = {};

    // $scope, $modalInstance
    $controller('clearCartCtrl', {
      $scope : $scope,
      $modalInstance : $modalInstance
    });
  }));

  it('closes the modal with ok()', function(){
    $modalInstance.close = sinon.spy();

    $scope.ok();

    expect($modalInstance.close).toHaveBeenCalledOnce;
  });

  it('dismisses the modal with cancel()', function(){
    $modalInstance.dismiss = sinon.spy();

    $scope.cancel();

    expect($modalInstance.dismiss).toHaveBeenCalledOnce;
  });

});
