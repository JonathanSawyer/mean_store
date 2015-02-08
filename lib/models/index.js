var bcrypt = require('bcrypt-nodejs'),
	crypto = require('crypto');

exports.Product = require('./product');
exports.User = require('./user')(bcrypt, crypto);
exports.Order = require('./order');