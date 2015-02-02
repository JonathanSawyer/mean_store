var server = require('../../app');

module.exports = {
	boot : function(done){
		server.boot(function(){
			done();
		});
	},
	shutdown : function(){
		server.shutdown();
	}
};