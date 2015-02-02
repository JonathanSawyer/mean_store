/* jshint expr: true */
var chai = require('chai'),
	should = chai.should(),
	sinonChai = require('sinon-chai'),
	sinon = require('sinon'),
	routes = require('../../../routes/product');

chai.use(sinonChai);

describe("Product routes", function(){
	var products = [
	{
		_id: 'a',
		name: "Product1",
		price: 199.99,
		category: "phones",
		description: "Description A",
		images: ["1.jpg", "2.jpg"]
	},
	{
		_id: 'b',
		name: "Product2",
		price: 799.99,
		category: "computers",
		description: "Description B",
		images: ["3.jpg", "4.jpg"]
	}
	];

	describe("list", function(){

		it("returns all products", function(){
			var find = sinon.stub();
			find.callsArgWith(1, null, products);

			var req = {
				models: {
					Product: {
						find: find
					}
				},
				query: {},
				user: {}
			};
			var res = { json: sinon.spy() };

			routes.list(req, res);

			find.should.have.been.calledWith({deleted: false});
			res.json.should.have.been.calledWith(products);
		});

		it("gets deleted products", function(){
			var find = sinon.stub();
			find.callsArgWith(1, null, products);

			var req = {
				models: {
					Product: {
						find: find
					}
				},
				query: { deleted : true },
				user: { role : 'admin'}
			};
			var res = { json: sinon.spy() };

			routes.list(req, res);

			find.should.have.been.calledWith({});
			res.json.should.have.been.calledWith(products);
		});

	});

	describe('find', function(){

		it('returns a product by id', function(){
			var product = products[0];
			var findById = sinon.stub();
			findById.callsArgWith(1, null, product);

			var req = {
				models : {
					Product : {
						findById : findById
					}
				},
				params : {id: product._id}
			};
			var res = { json : sinon.spy() };

			routes.find(req, res);

			findById.should.have.been.calledWith(product._id);
			res.json.should.have.been.calledWith(product);
		});
		
	});

	describe("create", function(){
		it("creates new products", function(){
			var prod = products[0];
			var model = {
				create : sinon.stub()
			};
			var createdProduct = {
				_id : 'ceae',
				name: prod.name,
				price : prod.price,
				category : prod.category,
				description : prod.description,
				images : prod.images
			};
			model.create.callsArgWith(1, null, createdProduct);
			var req = {
				body : prod,
				models : {
					Product : model
				}
			};
			var res = {
				json : sinon.spy()
			};

			routes.create(req, res);

			model.create.should.have.been.calledWith(prod);
			res.json.should.have.been.calledWith(createdProduct);
		});
	});

	describe("update", function(){
		it("updates an existing product", function(){
			var product = products[0];
			var model = {
				findByIdAndUpdate : sinon.stub()
			};
			model.findByIdAndUpdate.callsArgWith(2, null, product);
			var req = {
				params : { id : 'a' },
				models : {
					Product : model
				},
				body : product
			};
			var res = { json : sinon.spy() };

			routes.update(req, res);

			model.findByIdAndUpdate.should.have.been.calledWith('a', {$set: product});
			res.json.should.have.been.calledWith(product);
		});
	});

	describe("del", function(){
		it("deletes a product", function(){
			var model = {
				findByIdAndUpdate : sinon.stub()
			};
			model.findByIdAndUpdate.callsArgWith(2, null);
			var req = {
				params : { id : 'a' },
				models : {
					Product : model
				}
			};
			var res = {
				sendStatus : sinon.spy()
			};

			routes.del(req, res);

			model.findByIdAndUpdate.should.have.been.calledWith('a', {'deleted':true});
			res.sendStatus.should.have.been.calledWith(200);
		});
	});

	describe("getCategories", function(){
		it("gets all categories", function(){
			var model = {
				getCategories : sinon.stub()
			};
			var categories = ["catA", "catB"];
			model.getCategories.callsArgWith(0, null, categories);
			var req = {
				models : {
					Product : model
				}
			};
			var res = { json : sinon.spy() };

			routes.getCategories(req, res);

			model.getCategories.should.have.been.calledOnce;
			res.json.should.have.been.calledWith(categories);
		});

	});

	describe("search", function(){

		it("returns products by category", function(){
			var find = sinon.stub();
			find.callsArgWith(1, null, [products[0]]);

			var req = {
				models: {
					Product: {
						find: find
					}
				},
				query: { category: 'phones' }
			};
			var res = { json: sinon.spy() };

			routes.search(req, res);

			find.should.have.been.calledWith({category:'phones', deleted: false});
			res.json.should.have.been.calledWith([products[0]]);
		});

		it('returns all products', function(){
			var find = sinon.stub();
			find.callsArgWith(1, null, products);

			var req = {
				models: {
					Product: {
						find: find
					}
				},
				query: { category: 'all' }
			};
			var res = { json: sinon.spy() };

			routes.search(req, res);

			find.should.have.been.calledWith({deleted:false});
			res.json.should.have.been.calledWith(products);
		});

		it('returns items containing name', function(){
			var find = sinon.stub();
			find.callsArgWith(1, null, [products[0]]);

			var req = {
				models: {
					Product: {
						find: find
					}
				},
				query: { name: 'duct1' }
			};
			var res = { json: sinon.spy() };

			routes.search(req, res);

			find.should.have.been.calledWith({name : new RegExp('duct1', 'i'), deleted: false});
			res.json.should.have.been.calledWith([products[0]]);
		});

	});

});