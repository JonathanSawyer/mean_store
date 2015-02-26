describe('Order service', function(){
	var backend, svc;

	beforeEach(function(){
		module("storeApp.checkout");
		var cart = [
		{
			_id : 'a',
			quantity : 1,
			price : 10
		},
		{
			_id : 'b',
			quantity : 2,
			price : 20
		}
		];

		module(function($provide){
			var cartService = {
				getCart : sinon.stub().returns(cart)
			};
			$provide.value('cartService', cartService);
		});

		inject(function(orderService, $httpBackend){
			backend = $httpBackend;
			svc = orderService;
		});
	});

	afterEach(function(){
		backend.verifyNoOutstandingExpectation();
		backend.verifyNoOutstandingRequest();
	});

	describe("create()", function(){
		var user = {
			firstName : 'Test',
			lastName : 'User',
			streetAddress : 'Street',
			postalCode : '0000',
			city : 'City'
		};

		var expectedOrder = {
			receiver : user,
			products: [
			{
				product : 'a',
				quantity : 1,
				price : 10
			},
			{
				product : 'b',
				quantity : 2,
				price : 20
			}
			]
		};

		it('sends an order', function(){
			backend.expectPOST('/orders', expectedOrder)
				.respond(200);

			var returned = false;
			svc.create(user).then(function(res){
				returned = true;
			});
			backend.flush();

			expect(returned).toEqual(true);
		});

		it("rejects with error code if error", function(){
			backend.expectPOST('/orders', expectedOrder)
				.respond(500);

			var status;
			svc.create(user).then(function(){}, function(_status){
				status = _status;
			});
			backend.flush();

			expect(status).toEqual(500);
		});

	});

	describe("getAll()", function(){

		it("gets all orders", function(){
			var orders = [{_id: "a"}];
			backend.expectGET("/orders").respond(orders);

			var retOrders;
			svc.getAll().then(function(_orders){
				retOrders = _orders;
			});
			backend.flush();
			expect(retOrders).toEqual(orders);
		});

		it("rejects with error code if error", function(){
			backend.expectGET("/orders").respond(500);

			var status;
			svc.getAll().then(function(){}, function(_status){
				status = _status;
			});
			backend.flush();

			expect(status).toEqual(500);
		});

	});

	describe("getById()", function(){

		it("gets an order by id", function(){
			var order = {_id: "a"};
			backend.expectGET("/orders/a").respond(order);

			var retOrder;
			svc.getById("a").then(function(_order){
				retOrder = _order;
			});
			backend.flush();
			expect(retOrder).toEqual(order);
		});

		it("rejects with error code if error", function(){
			backend.expectGET("/orders/a").respond(500);

			var status;
			svc.getById("a").then(function(){}, function(_status){
				status = _status;
			});
			backend.flush();

			expect(status).toEqual(500);
		});

	});

	describe("update()", function(){

		it("updates an order", function(){
			var order = {_id: "a"};
			backend.expectPUT("/orders/a").respond(order);

			var retOrder;
			svc.update(order).then(function(_order){
				retOrder = _order;
			});
			backend.flush();

			expect(retOrder).toEqual(order);
		});

		it("rejects with error code if error", function(){
			var order = {_id: "a"};
			backend.expectPUT("/orders/a").respond(500);

			var status;
			svc.update(order).then(function(){}, function(_status){
				status = _status;
			});
			backend.flush();

			expect(status).toEqual(500);
		});

	});

});
