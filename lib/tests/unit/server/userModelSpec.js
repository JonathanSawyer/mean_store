var chai = require('chai'),
	should = chai.should(),
	sinonChai = require('sinon-chai'),
	sinon = require('sinon'),
	bcrypt = require('bcrypt-nodejs');

chai.use(sinonChai);

var User = require('../../../models/user');

describe("User model", function(){
	var user;

	beforeEach(function(){
		user = new User();
	});

	describe.skip("hashAndSavePwd", function(){

		it("hashes a password and saves it", function(done){
			var user = new User();
			user.save = sinon.stub();
			user.save.callsArgWith(0, null, user);

			user.hashAndSavePassword("password", function(err, user){
				should.not.exist(err);

				var pwd = user.password;

				bcrypt.compareSync("password", pwd).should.equal(true);

				done();
			});
		});

	});

	describe.skip("isValidPassword", function(){

		it("returns true if password is valid", function(done){
			var hash = bcrypt.hashSync("password");
			user.password = hash;
			user.isValidPassword("password", function(err, res){
				should.not.exist(err);
				res.should.equal(true);
				done();
			});
		});

		it("returns false if password is invalid", function(done){
			var hash = bcrypt.hashSync("password");
			user.password = hash;
			user.isValidPassword("a", function(err, res){
				should.not.exist(err);
				res.should.equal(false);
				done();
			});
		});

	});


});