/* jshint expr: true */
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

    var ITEMS = [
      {
        quantity : 1,
        price : 10
      },
      {
        quantity : 2,
        price : 20
      }
    ];
    var totalPrice;

    beforeEach(function(){
      cartSvc.getCart.returns(ITEMS);
      totalPrice = ITEMS.reduce(function(prev, row){
        return prev + (row.quantity * row.price);
      }, 0);
      $scope.$apply();
    });

    it("shows the total price", function(){
      var totalElem = elem.find('p > b');

      expect(totalElem.html()).toContain(totalPrice);
    });

    it("shows the items", function(){
      var items = elem.find("tbody > tr");

      expect(items.length).toEqual(ITEMS.length);
    });

    it("shows the item quantities", function(){
      var elems = elem.find("input[type='number']");

      expect(elems.eq(0).val()).toEqual('1');
      expect(elems.eq(1).val()).toEqual('2');
    });

    it("shows the item prices", function(){
      var items = elem.find("tbody > tr");

      expect(items.eq(0).html()).toContain(String(ITEMS[0].price));
      expect(items.eq(1).html()).toContain(String(ITEMS[1].price));
    });

    it("shows the row totals", function(){
      var items = elem.find("tbody > tr");

      expect(items.eq(0).html()).toContain(String(ITEMS[0].price * ITEMS[0].quantity));
      expect(items.eq(1).html()).toContain(String(ITEMS[1].price * ITEMS[1].quantity));
    });

    describe("the decrement button", function(){

      it("calls decrementQuantity() when pressed", function(){
        cartSvc.decrementQuantity = sinon.spy();
        var btn = elem.find("button[ng-click*='decrement']").eq(1);

        btn.triggerHandler("click");

        expect(cartSvc.decrementQuantity).toHaveBeenCalledOnce;
      });

      it("is disabled when quantity is 1", function(){
        cartSvc.decrementQuantity = sinon.spy();
        var btn = elem.find("button[ng-click*='decrement']").eq(0);

        var disabled = btn.attr("disabled");

        expect(disabled).toEqual("disabled");
      });

    });

    describe("the increment button", function(){

      it("calls incrementQuantity() when pressed", function(){
        cartSvc.incrementQuantity = sinon.spy();
        var btn = elem.find("button[ng-click*='increment']").eq(0);

        btn.triggerHandler("click");

        expect(cartSvc.incrementQuantity).toHaveBeenCalledWith(ITEMS[0]);
      });

    });

    describe("the remove button", function(){

      it("calls removeItem()", function(){
        var btn = elem.find("button[ng-click*='remove']").eq(0);
        cartSvc.removeItem = sinon.spy();

        btn.triggerHandler("click");

        expect(cartSvc.removeItem).toHaveBeenCalledWith(ITEMS[0]);
      });

    });

  });

});
