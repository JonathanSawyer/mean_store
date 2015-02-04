var devUrl = 'mongodb://@localhost:27017/webstore-dev',
	prodUrl = 'mongodb://@localhost:27017/webstore',
	testUrl = 'mongodb://@localhost:27017/webstore-test';

switch(process.env.NODE_ENV){
	case 'production':
		console.log('Using production db');
		exports.url = prodUrl;
		break;
	case 'development':
		console.log('Using dev db');
		exports.url = devUrl;
		break;
	case 'test':
		console.log('Using test db');
		exports.url = testUrl;
		break;
	default:
		console.log('Using dev db');
		exports.url = devUrl;
		break;
}

exports.mongooseOpts = {
	safe : true
};