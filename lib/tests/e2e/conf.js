var config = {
	specs: ['*Spec.js'],

	framework: 'jasmine2'
};

if(process.env.TRAVIS){
	config.sauceUser = process.env.SAUCE_USERNAME;
	config.sauceKey = process.env.SAUCE_ACCESS_KEY;
	config.capabilities = {
		'browserName' : process.env.E2E_BROWSER,
		'tunnel-identifier' : process.env.TRAVIS_JOB_NUMBER,
		'build' : process.env.TRAVIS_BUILD_NUMBER,
		'name' : "MEAN Store build " + process.env.TRAVIS_BUILD_NUMBER,
		'platform' : process.env.E2E_OS,
		'seleniumVersion' : "2.43.0"
	};
	if(process.env.E2E_BROWSER_VERSION){
		config.capabilities.version = process.env.E2E_BROWSER_VERSION;
	}
	// config.multiCapabilities = [
	// {
	// 	'browserName' : 'chrome',
	// 	'tunnel-identifier' : process.env.TRAVIS_JOB_NUMBER,
	// 	'build' : process.env.TRAVIS_BUILD_NUMBER,
	// 	'name' : "MEAN Store build " + process.env.TRAVIS_BUILD_NUMBER
	// },
	// {
	// 	'browserName' : 'firefox',
	// 	'tunnel-identifier' : process.env.TRAVIS_JOB_NUMBER,
	// 	'build' : process.env.TRAVIS_BUILD_NUMBER,
	// 	'name' : "MEAN Store build " + process.env.TRAVIS_BUILD_NUMBER
	// }
	// ];
	// config.capabilities["tunnel-identifier"] = process.env.TRAVIS_JOB_NUMBER;
	// config.capabilities.build = process.env.TRAVIS_BUILD_NUMBER;
	// config.capabilities.name = "MEAN Store build " + process.env.TRAVIS_BUILD_NUMBER;
}else{
	config.capabilities = {
		browserName : process.env.E2E_BROWSER
	};
	config.seleniumServerJar = '../../../node_modules/protractor/selenium/selenium-server-standalone-2.44.0.jar';
}

exports.config = config;
