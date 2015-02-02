describe("Capitalize filter", function(){
	var capFilter;

	beforeEach(module("storeApp"));

	beforeEach(inject(function($filter){
		capFilter = $filter("capitalize");
	}));

	it("makes first character uppercase, rest lowercase", function(){
		var input = "tHis is A TEST";
		var expectedOutput = "This is a test";

		var output = capFilter(input);

		expect(output).toEqual(expectedOutput);
	});

	it("uppercases 1 character", function(){
		var input = "a";
		var expectedOutput = "A";

		var output = capFilter(input);

		expect(output).toEqual(expectedOutput);
	});

	it("handles empty strings", function(){
		var out = capFilter("");
		expect(out).toBeUndefined();
	});

});