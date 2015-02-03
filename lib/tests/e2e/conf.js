var config = {
	specs: ['*Spec.js'],

	framework: 'jasmine2'
};

if(process.env.TRAVIS){
	config.sauceUser = process.env.SAUCE_USERNAME;
	config.sauceKey = process.env.SAUCE_ACCESS_KEY;
	config.multiCapabilities = [
	{
		'browserName' : 'chrome',
		'tunnel-identifier' : process.env.TRAVIS_JOB_NUMBER,
		'build' : process.env.TRAVIS_BUILD_NUMBER,
		'name' : "MEAN Store build " + process.env.TRAVIS_BUILD_NUMBER
	},
	{
		'browserName' : 'firefox',
		'tunnel-identifier' : process.env.TRAVIS_JOB_NUMBER,
		'build' : process.env.TRAVIS_BUILD_NUMBER,
		'name' : "MEAN Store build " + process.env.TRAVIS_BUILD_NUMBER
	}
	];
	// config.capabilities["tunnel-identifier"] = process.env.TRAVIS_JOB_NUMBER;
	// config.capabilities.build = process.env.TRAVIS_BUILD_NUMBER;
	// config.capabilities.name = "MEAN Store build " + process.env.TRAVIS_BUILD_NUMBER;
}else{
	config.capabilities = {
		browserName : 'chrome'
	};
	config.seleniumServerJar = '../../../node_modules/protractor/selenium/selenium-server-standalone-2.44.0.jar';
}

exports.config = config;