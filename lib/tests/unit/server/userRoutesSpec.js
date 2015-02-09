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

			req.logIn.should.have.been.calledWith(user);
			res.json.should.have.been.calledWith(user);
		});

		it('sends status 401 if email existed', function(){
			var passport = {
				authenticate : sinon.stub().callsArgWith(1, null, false)
			};
			var authRet = sinon.spy();
			passport.authenticate.returns(authRet);
			var req = {};
			var res = {
				sendStatus : sinon.spy()
			};

			routes.signup(passport)(req, res);

			res.sendStatus.should.have.been.calledWith(401);
		});

	});

	describe("login", function(){
		var passport;
		beforeEach(function(){
			passport = {
				authenticate : sinon.stub()
			};
			passport.authenticate.returns(function(req, res, next){});
		});

		it("logs in a user", function(){
			var user = {email:"test@test.com"};
			passport.authenticate.callsArgWith(1, null, user);
			var req = {
				logIn : sinon.stub(),
				body : {}
			};
			req.logIn.callsArgWith(1, null);
			var res = {
				json : sinon.spy()
			};

			routes.login(passport)(req, res);

			req.logIn.should.have.been.calledWith(user);
			res.json.should.have.been.calledWith({user : user});
		});

		it('sends status 401 if log in is not valid', function(){
			passport.authenticate.callsArgWith(1, null, false);
			var req = {};
			var res = {
				sendStatus : sinon.spy()
			};

			routes.login(passport)(req, res);

			res.sendStatus.should.have.been.calledWith(401);
		});

		it('generates a re-authentication token if remember me is set', function(){
			var token = 'reauthtoken';
			var hash = 'reauthtokenHash';
			var user = {
				email : 'reauth@email.com'
			};
			user.generateNewReauthToken = sinon.stub().callsArgWith(0, null, {
				email : user.email,
				reauthToken : hash
			}, token);
			passport.authenticate.callsArgWith(1, null, user);
			var req = {
				logIn : sinon.stub(),
				body : {
					email : user.email,
					password : 'a',
					rememberMe : true
				}
			};
			req.logIn.callsArgWith(1, null);
			var res = {
				json : sinon.spy()
			};

			routes.login(passport)(req, res);

			res.json.should.have.been.calledWith({user : {
				email : user.email,
				password : undefined,
				reauthToken : undefined
			}, token : token});
		});

	});

});