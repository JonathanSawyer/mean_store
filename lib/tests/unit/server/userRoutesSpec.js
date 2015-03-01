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

	describe("reauth", function(){
		var req;

		beforeEach(function(){
			req = {
				body : { email : "reauth@email.com" },
				models : {
					User : {}
				}
			};
		});

		it("finds a user by email", function(){
			var findOne = req.models.User.findOne = sinon.spy();

			routes.reauth(req, null, null);

			findOne.should.have.been.calledWith({ email : req.body.email}, "+reauthToken");
		});

		it("returns error if there is a DB error", function(){
			req.models.User.findOne = sinon.stub().callsArgWith(2, "An error");
			var next = sinon.spy();

			routes.reauth(req, null, next);

			next.should.have.been.calledWith("An error");
		});

		it("returns no auth if user not found with email", function(){
			req.models.User.findOne = sinon.stub().callsArgWith(2, null, null);

			var res = {
				json : sinon.spy()
			};

			routes.reauth(req, res, null);

			res.json.should.have.been.calledWith({auth : false});
		});

		it("returns no auth if token is not valid", function(){
			var user = {
				isValidReauthToken : sinon.stub().returns(false)
			};
			req.models.User.findOne = sinon.stub().callsArgWith(2, null, user);
			req.body.token = "token";

			var res = {
				json : sinon.spy()
			};

			routes.reauth(req, res, null);

			res.json.should.have.been.calledWith({auth : false});
			user.isValidReauthToken.should.have.been.calledWith("token");
		});

		it("returns an error if there is an error generating new token", function(){
			var user = {
				isValidReauthToken : sinon.stub().returns(true),
				generateNewReauthToken : sinon.stub().callsArgWith(0, "An error")
			};
			req.models.User.findOne = sinon.stub().callsArgWith(2, null, user);
			req.body.token = "token";

			var next = sinon.spy();

			routes.reauth(req, null, next);

			next.should.have.been.calledWith("An error");
		});

		describe("when all goes fine", function(){
			var res, user;

			beforeEach(function(){
				user = {
					isValidReauthToken : sinon.stub().returns(true),
					reauthToken : "tokenHash"
				};
				user.generateNewReauthToken = sinon.stub().callsArgWith(0, null, user, "new token");

				req.models.User.findOne = sinon.stub().callsArgWith(2, null, user);
				req.body.token = "token";
				res = {
					json : sinon.spy()
				};
			});

			it("returns auth true, user info and the new token", function(){
				routes.reauth(req, res, null);

				should.not.exist(user.reauthToken);

				res.json.should.have.been.calledWith({
					auth : true,
					user : user,
					token : "new token"
				});
			});

		});

	});

});
