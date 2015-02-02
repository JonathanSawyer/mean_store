/* jshint expr: true */

var chai = require('chai'),
	should = chai.should(),
	sinonChai = require('sinon-chai'),
	sinon = require('sinon'),
	routes = require('../../../routes/user');

chai.use(sinonChai);

describe("User routes", function(){

	describe("signup", function(){

		it("registers a user with Passport", function(){
			var passport = {
				authenticate : sinon.stub()
			};
			var user = {email:"asdf@asdf.com"};
			passport.authenticate.callsArgWith(1, null, user);
			var authRet = sinon.spy();
			passport.authenticate.returns(authRet);
			var req = {
				logIn : sinon.stub()
			};
			req.logIn.callsArgWith(1, null);
			var res = {
				json : sinon.spy()
			};

			routes.signup(passport)(req, res);

			passport.authenticate.should.have.been.calledWith("local-signup");
			req.logIn.should.have.been.calledWith(user);
			res.json.should.have.been.calledWith(user);
			authRet.should.have.been.calledOnce;
		});

		it('sends status 401 if email existed', function(){
			var passport = {
				authenticate : sinon.stub()
			};
			var user = {email:"asdf@asdf.com"};
			passport.authenticate.callsArgWith(1, null, false);
			var authRet = sinon.spy();
			passport.authenticate.returns(authRet);
			var req = {};
			var res = {
				sendStatus : sinon.spy()
			};

			routes.signup(passport)(req, res);

			passport.authenticate.should.have.been.calledWith("local-signup");
			res.sendStatus.should.have.been.calledWith(401);
			authRet.should.have.been.calledOnce;
		});

	});

	describe("login", function(){

		it("logs in a user", function(){
			var passport = {
				authenticate : sinon.stub()
			};
			var user = {email:"asdf@asdf.com"};
			passport.authenticate.callsArgWith(1, null, user);
			var authRet = sinon.spy();
			passport.authenticate.returns(authRet);
			var req = {
				logIn : sinon.stub()
			};
			req.logIn.callsArgWith(1, null);
			var res = {
				json : sinon.spy()
			};

			routes.login(passport)(req, res);

			passport.authenticate.should.have.been.calledWith("local-login");
			req.logIn.should.have.been.calledWith(user);
			res.json.should.have.been.calledWith(user);
			authRet.should.have.been.calledOnce;
		});

		it('sends status 401 if log in is not valid', function(){
			var passport = {
				authenticate : sinon.stub()
			};
			var user = {email:"asdf@asdf.com"};
			passport.authenticate.callsArgWith(1, null, false);
			var authRet = sinon.spy();
			passport.authenticate.returns(authRet);
			var req = {};
			var res = {
				sendStatus : sinon.spy()
			};

			routes.login(passport)(req, res);

			passport.authenticate.should.have.been.calledWith("local-login");
			res.sendStatus.should.have.been.calledWith(401);
			authRet.should.have.been.calledOnce;
		});

	});

});