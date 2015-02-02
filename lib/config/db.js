var devUrl = 'mongodb://@localhost:27017/webstore-dev',
	prodUrl = 'mongodb://@localhost:27017/webstore',
	testUrl = 'mongodb://@localhost:27017/webstore-test';

switch(process.env.NODE_ENV){
	case 'production':
		exports.url = prodUrl;
		break;
	case 'development':
		exports.url = devUrl;
		break;
	case 'test':
		exports.url = testUrl;
		break;
	default:
		exports.url = devUrl;
		break;
}

exports.mongooseOpts = {
	safe : true
};