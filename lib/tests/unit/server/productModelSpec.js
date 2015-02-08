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

});