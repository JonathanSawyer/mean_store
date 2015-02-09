/* jshint expr: true */
var chai = require('chai'),
	should = chai.should(),
	sinonChai = require('sinon-chai'),
	sinon = require('sinon'),
	bcrypt = require('bcrypt-nodejs');

chai.use(sinonChai);

describe("User model", function(){
	var user;

	var stubBcrypt;
	var stubCrypto;

	beforeEach(function(){
		stubBcrypt = {
			genSalt : sinon.stub().callsArgWith(1, null, 'salt'),
			hash : function(pw, salt, arg, cb){
				cb(null, pw + 'hash'); //No hashing done
			},
			compare : function(a, b, cb){
				cb(null, a + 'hash' === b);
			}
		};
		stubCrypto = {
			randomBytes : sinon.stub().callsArgWith(1, null, {
				toString : sinon.stub().returns('abcdef')
			}),
			createHash : sinon.stub().returns({
				update : function(token){
					return {
						digest : sinon.stub().returns(token)
					};
				}
			})
		};
		var User = require('../../../models/user')(stubBcrypt, stubCrypto);
		user = new User({
			firstName : 'Test',
			lastName : 'User',
			email : 'test@test.com',
			password : 'a', //Not a valid hash yes
			streetAddress : 'Street 1',
			postalCode : '11111',
			city : 'City'
		});
		user.save = sinon.stub().callsArgWith(0, null, user);
	});

	describe("hashAndSavePwd", function(){

		it("hashes a password and saves it", function(done){
			user.hashAndSavePassword("password", function(err, user){
				should.not.exist(err);
				user.password.should.equal('passwordhash');
				done();
			});
		});

	});

	describe("isValidPassword", function(){

		it("returns true if password is valid", function(done){
			user.password = "passwordhash";
			user.isValidPassword("password", function(err, res){
				should.not.exist(err);
				res.should.equal(true);

				done();
			});
		});

		it("returns false if password is invalid", function(done){
			user.password = "passwordhash";
			user.isValidPassword("a", function(err, res){
				should.not.exist(err);
				res.should.equal(false);
				done();
			});
		});

	});


	describe('generateNewReauthToken()', function(){

		it('creates a new reauthentication token', function(done){
			user.save(function(err){
				if(err) return done(err);

				user.generateNewReauthToken(function(err, sUser, token){
					if(err) return done(err);

					should.exist(sUser.reauthToken);
					should.exist(token);

					sUser.reauthToken.should.equal(token); //Only by the stub it equals

					done();
				});

			});
		});

	});

	describe('isValidReauthToken()', function(){

		it('returns true for valid token', function(){
			user.reauthToken = 'token';

			var result = user.isValidReauthToken('token');

			result.should.equal(true);
		});

		it('returns false for an invalid token', function(){
			user.reauthToken = 'token';

			var result = user.isValidReauthToken('wrong');

			result.should.equal(false);
		});

		it('returns false if token is undefined', function(){
			user.reauthToken = undefined;

			var result = user.isValidReauthToken('token');

			result.should.equal(false);
		});

	});

});