describe('cartTable directive', function(){
  var $scope, elem, cartSvc;

  beforeEach(function(){
    module("partials/cartTable.html");
    module("storeApp.cart");

    module(function($provide){
      cartSvc = {
        getCart : sinon.stub().returns([])
      };
      $provide.value("cartService", cartSvc);
    });

    inject(function($compile, $rootScope){
      $scope = $rootScope.$new();

      var html = '<cart-table />';
      elem = $compile(html)($scope);
      $scope.$digest();
      console.log(elem.html());
    });
  });

  describe('when there are no items', function(){

    it('shows 0 items', function(){
      var elems = elem.find('tbody tr');
      expect(elems.length).toEqual(0);
    });

    it('shows a total price of 0', function(){
      var totalElem = elem.find('p > b');

      expect(totalElem.html()).toContain('0.00');
    });

  });

});
