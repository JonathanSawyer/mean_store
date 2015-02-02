var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
	firstName : {
		type: String,
		required: true
	},
	lastName : {
		type: String,
		required: true
	},
	email : {
		type: String,
		required: true,
		validate : function(email){
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		},
		set : function(email){
			return email.toLowerCase();
		}
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	streetAddress : {
		type: String,
		required: true
	},
	postalCode : {
		type: String,
		required: true
	},
	city : {
		type: String,
		required: true
	},
	role : {
		type: String,
		default: "customer"
	}
});

userSchema.methods.hashAndSavePassword = function(pw, done){
	var that = this;
	bcrypt.genSalt(10, function(err, salt){
		if(err) return done(err);

		bcrypt.hash(pw, salt, null, function(err, hash){
			if(err) return done(err);

			that.password = hash;
			that.save(done);
		});
	});
};

userSchema.methods.isValidPassword = function(pw, done){
	bcrypt.compare(pw, this.password, done);
};

if (mongoose.models.User) {
	module.exports = mongoose.model('User');
} else {
	module.exports = mongoose.model('User', userSchema);
}