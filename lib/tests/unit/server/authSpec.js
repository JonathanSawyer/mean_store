/* jshint expr: true */

var chai = require('chai'),
	should = chai.should(),
	sinonChai = require('sinon-chai'),
	sinon = require('sinon'),
	auth = require('../../../config/auth');

chai.use(sinonChai);

describe("Auth methods: ", function(){

	describe("isAuthenticated", function(){

		it("calls next if authenticated", function(){
			var isAuthenticated = sinon.stub();
			isAuthenticated.returns(true);
			var req = {
				isAuthenticated : isAuthenticated
			};
			var res = {};
			var next = sinon.spy();

			auth.isAuthenticated(req, res, next);

			next.should.have.been.calledOnce;
		});

		it("sends 401 if not authenticated", function(){
			var isAuthenticated = sinon.stub();
			isAuthenticated.returns(false);
			var req = {
				isAuthenticated : isAuthenticated
			};
			var res = { sendStatus : sinon.spy() };
			var next = sinon.spy();

			auth.isAuthenticated(req, res, next);

			next.should.not.have.been.called;
			res.sendStatus.should.have.been.calledWith(401);
		});

	});

	describe("isAdmin", function(){

		it("allows admins access", function(){
			var user = {
				role : 'admin'
			};
			var req = { user : user };
			var res = {};
			var next = sinon.spy();

			auth.isAdmin(req, res, next);

			next.should.have.been.calledOnce;
		});

		it("denies non-admins access", function(){
			var user = {
				role : 'customer'
			};
			var req = { user : user };
			var res = { sendStatus : sinon.spy() };
			var next = sinon.spy();

			auth.isAdmin(req, res, next);

			next.should.not.have.been.called;
			res.sendStatus.should.have.been.calledWith(401);
		});

	});

});