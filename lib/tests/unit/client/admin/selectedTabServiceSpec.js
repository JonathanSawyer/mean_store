describe("selectedTabService", function(){
  var svc;

  beforeEach(module("storeApp.admin"));

  beforeEach(inject(function(selectedTabService){
    svc = selectedTabService;
  }));

  it("default is products", function(){
    expect(svc.get()).toEqual("products");
  });

  it("sets a selected tab", function(){
    svc.set("orders");
    
    expect(svc.get()).toEqual("orders");
  });

});
