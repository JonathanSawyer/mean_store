/* jshint expr: true */
describe("User service", function(){
	var $httpBackend, $localStorage, svc;

	beforeEach(module("storeApp.users"));

	beforeEach(module(function($provide){
		$localStorage = {
			$default : sinon.stub(),
			$reset : sinon.stub()
		};

		$provide.value('$localStorage', $localStorage);
	}));

	beforeEach(inject(function(_$httpBackend_, userService){
		$httpBackend = _$httpBackend_;

		svc = userService;
	}));

	afterEach(function(){
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	describe('logout()', function(){

		it('should delete reauth token and email from storage', function(){
			$httpBackend.expectGET('/users/logout').respond(200);
			$localStorage.reauthToken = 'token';
			$localStorage.userEmail = 'test@test.com';

			svc.logout();
			$httpBackend.flush();

			expect($localStorage.reauthToken).toBeUndefined();
			expect($localStorage.userEmail).toBeUndefined();
		});

	});

	describe('checkauth()', function(){

		var sessionExists = function(){
			$httpBackend.expectGET('/users/checkauth').respond({
				auth : true,
				user : {
					email : 'test@test.com'
				}
			});
		};

		var noSession = function(){
			$httpBackend.expectGET('/users/checkauth').respond({ auth : false });
		};

		it('returns true if session is still active', function(){
			sessionExists();
			
			var auth, user;
			svc.checkauth().then(function(data){
				auth = data.auth;
				user = data.user;
			});
			$httpBackend.flush();

			expect(auth).toBe(true);
			expect(user).toEqual({ email : 'test@test.com' });
		});

		it('returns true if re-authentication is successful', function(){
			noSession();
			$localStorage.reauthToken = 'token';
			$localStorage.userEmail = 'test@test.com';
			$httpBackend.expectPOST('/users/reauth', {
				token : $localStorage.reauthToken,
				email : $localStorage.userEmail
			}).respond({
				auth : true,
				token : 'newToken',
				user : {
					email : 'test@test.com'
				}
			});

			var auth, user;
			svc.checkauth().then(function(data){
				auth = data.auth;
				user = data.user;
			});
			$httpBackend.flush();

			expect(auth).toBe(true);
			expect(user).toEqual({ email : 'test@test.com' });
		});

		it('returns false if session is not active and no re-auth token is found', function(){
			noSession();

			var auth;
			svc.checkauth().then(function(data){
				auth = data.auth;
			});
			$httpBackend.flush();

			expect(auth).toBe(false);
		});

		it('returns false if session is not active and re-auth fails', function(){
			noSession();
			$localStorage.reauthToken = 'token';
			$localStorage.userEmail = 'test@test.com';
			$httpBackend.expectPOST('/users/reauth', {
				token : $localStorage.reauthToken,
				email : $localStorage.userEmail
			}).respond({
				auth : false
			});

			var auth;
			svc.checkauth().then(function(data){
				auth = data.auth;
			});
			$httpBackend.flush();

			expect(auth).toBe(false);
		});

	});

});