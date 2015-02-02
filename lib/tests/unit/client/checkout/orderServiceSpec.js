describe('orderService', function(){
	var backend, svc;
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

	beforeEach(function(){
		module("storeApp.checkout");

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

	describe("create", function(){

		it('sends an order', function(){
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

			backend.expectPOST('/orders', expectedOrder)
				.respond(200);

			var returned = false;
			svc.create(user).then(function(res){
				returned = true;
			});
			backend.flush();
			expect(returned).toEqual(true);
		});

	});

});