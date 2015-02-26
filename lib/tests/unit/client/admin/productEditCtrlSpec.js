describe('productEditCtrl', function(){
  var $scope, $rootScope, $location, $controller, $routeParams, $q, prodSvc, categoryDefer;

  beforeEach(module("storeApp.admin"));

  beforeEach(inject(function(_$q_, _$controller_, _$rootScope_){
    $q = _$q_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $routeParams = { id : 'new' }; //Good default as it doesn't require any kind of stubs
    $location = {};

    categoryDefer = $q.defer();
    prodSvc = {
      getCategories : sinon.stub().returns(categoryDefer.promise)
    };

  }));

  function initController(){
    // $scope, $routeParams, $location, productService
    $controller("productEditCtrl", {
      $scope : $scope,
      $routeParams : $routeParams,
      $location : $location,
      productService : prodSvc
    });
  }

  describe('on initialize', function(){

    it('sets mode to create if id === new', function(){
      $routeParams.id = 'new';

      initController();

      expect($scope.mode).toEqual('create');
    });

    it('gets categories', function(){
      var CATEGORIES = ["phones", "some stuff"];

      initController();
      categoryDefer.resolve(CATEGORIES);
      $rootScope.$apply();

      expect($scope.categories).toEqual(CATEGORIES);
    });

    describe('if id is a product id', function(){
      var prodDefer;

      beforeEach(function(){
        prodDefer = $q.defer();
        prodSvc.getById = sinon.stub().returns(prodDefer.promise);
      });

      it('sets mode to edit', function(){
        $routeParams.id = 'a';

        initController();

        expect($scope.mode).toEqual('edit');
      });

      it('gets a product and sets it to scope', function(){
        var PRODUCT = {
          _id : 'a',
          name : 'Some product'
        };
        $routeParams.id = PRODUCT._id;

        initController();
        prodDefer.resolve(PRODUCT);
        $rootScope.$apply();

        expect($scope.product).toEqual(PRODUCT);
      });

    });

  });

  describe('save', function(){
    var PRODUCT = {
      _id : 'a',
      name : 'Some product'
    };

    beforeEach(function(){
      initController();
    });

    it('updates the product if mode is edit', function(){
      $scope.mode = 'edit';
      var defer = $q.defer();
      prodSvc.update = sinon.stub().returns(defer.promise);
      $location.path = sinon.spy();

      $scope.save(PRODUCT);
      defer.resolve();
      $rootScope.$apply();

      expect(prodSvc.update).toHaveBeenCalledWith(PRODUCT);
      expect($location.path).toHaveBeenCalledWith('/admin');
    });

    it('creates a new product otherwise', function(){
      $scope.mode = 'create';
      var defer = $q.defer();
      prodSvc.create = sinon.stub().returns(defer.promise);
      $location.path = sinon.spy();

      $scope.save(PRODUCT);
      defer.resolve();
      $rootScope.$apply();

      expect(prodSvc.create).toHaveBeenCalledWith(PRODUCT);
      expect($location.path).toHaveBeenCalledWith('/admin');
    });

  });

  describe('remove', function(){
    var PRODUCT = {
      _id : 'a',
      name : 'Some product'
    };

    beforeEach(function(){
      initController();
    });

    it('removes a product', function(){
      var defer = $q.defer();
      prodSvc.remove = sinon.stub().returns(defer.promise);
      $location.path = sinon.spy();

      $scope.remove(PRODUCT);
      defer.resolve();
      $rootScope.$apply();

      expect(prodSvc.remove).toHaveBeenCalledWith(PRODUCT);
      expect($location.path).toHaveBeenCalledWith('/admin');
    });

  });

  describe('undelete', function(){
    var updateDefer;

    beforeEach(function(){
      initController();
      updateDefer = $q.defer();
      prodSvc.update = sinon.stub().returns(updateDefer.promise);
    });

    it('sets product deleted property to false', function(){
      var product = {
        _id : 'a',
        name : 'Some product'
      };

      $scope.undelete(product);

      expect(product.deleted).toBe(false);
    });

    it('updates the product', function(){
      var product = {
        _id : 'a',
        name : 'Some product'
      };
      $location.path = sinon.spy();

      $scope.undelete(product);
      updateDefer.resolve();
      $rootScope.$apply();

      expect($location.path).toHaveBeenCalledWith('/admin');
      expect(prodSvc.update).toHaveBeenCalledWith(product);
    });

  });

});
