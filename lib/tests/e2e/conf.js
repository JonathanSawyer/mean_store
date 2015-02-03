var config = {
	// seleniumServerJar: '../../../node_modules/protractor/selenium/selenium-server-standalone-2.44.0.jar',
	//sauceUser : 'juunas11',
	//sauceKey : 'a807b117-8488-41f8-8ac6-7f4943c3f6a9',
	capabilities: {
		'browserName': 'chrome'
	},

	specs: ['*Spec.js'],

	framework: 'jasmine2'
};

if(process.env.TRAVIS){
	config.sauceUser = process.env.SAUCE_USERNAME;
	config.sauceKey = process.env.SAUCE_ACCESS_KEY;
	config.capabilities["tunnel-identifier"] = process.env.TRAVIS_JOB_NUMBER;
	config.capabilities.build = process.env.TRAVIS_BUILD_NUMBER;
	config.capabilities.name = "MEAN Store build " + process.env.TRAVIS_BUILD_NUMBER;
}else{
	config.seleniumServerJar = '../../../node_modules/protractor/selenium/selenium-server-standalone-2.44.0.jar';
}

exports.config = config;