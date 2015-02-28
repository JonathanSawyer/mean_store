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

  describe("when there are items in the cart", function(){

    beforeEach(function(){
      cartSvc.getCart.returns([
        {
          quantity : 1,
          price : 10
        },
        {
          quantity : 2,
          price : 20
        }
      ]);
      $scope.$apply();
    });

    it("shows the total price", function(){
      var totalElem = elem.find('p > b');

      expect(totalElem.html()).toContain('50.00');
    });

    it("shows the items", function(){
      var items = elem.find("tbody > tr");

      expect(items.length).toEqual(2);
    });

  });

});
