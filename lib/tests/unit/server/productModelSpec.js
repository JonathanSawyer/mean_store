/* jshint expr: true */
var chai = require('chai'),
	should = chai.should(),
	sinonChai = require('sinon-chai'),
	sinon = require('sinon'),
	Product = require('../../../models/product');

chai.use(sinonChai);

describe("Product model", function(){
	var product;

	beforeEach(function(){
		product = new Product();
	});

	describe("getCategories", function(){
		var origFind;

		beforeEach(function(){
			origFind = Product.find;
		});

		afterEach(function(){
			Product.find = origFind;
		});

		it("finds distinct categories", function(){
			Product.find = sinon.stub();
			var distinct = sinon.spy();
			Product.find.returns({
				distinct : distinct
			});
			var cb = function(){};

			Product.getCategories(cb);

			Product.find.should.have.been.calledOnce;
			distinct.should.have.been.calledWith('category', cb);
		});

	});

	describe("validation", function(){
		var product;

		beforeEach(function(){
			product = new Product({
				name : "name",
				price : 200,
				category : "phones"
			});
		});

		it("does not allow a negative price", function(done){
			product.price = -2;
			product.validate(function(err){
				should.exist(err.errors.price);
				done();
			});
		});

		it("requires a name", function(done){
			product.name = undefined;
			product.validate(function(err){
				should.exist(err.errors.name);
				done();
			});
		});

		it("requires a price", function(done){
			product.price = undefined;
			product.validate(function(err){
				should.exist(err.errors.price);
				done();
			});
		});

		it("requires a category", function(done){
			product.category = undefined;
			product.validate(function(err){
				should.exist(err.errors.category);
				done();
			});
		});

	});

});
