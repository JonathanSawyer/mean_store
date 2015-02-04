describe("Capitalize filter", function(){
	var capFilter;

	beforeEach(module("storeApp"));

	beforeEach(inject(function($filter){
		capFilter = $filter("capitalize");
	}));

	it("makes first character uppercase, rest lowercase", function(){
		var output = capFilter("tHis is A TEST");

		expect(output).toEqual("This is a test");
	});

	it("uppercases 1 character", function(){
		var output = capFilter("a");

		expect(output).toEqual("A");
	});

	it("handles empty strings", function(){
		var out = capFilter("");
		expect(out).toBeUndefined();
	});

});