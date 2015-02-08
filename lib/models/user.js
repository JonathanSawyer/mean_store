var mongoose = require('mongoose');

module.exports = function(bcrypt, crypto){
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
		reauthToken : {
			type : String,
			required : false,
			select : false
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

	userSchema.methods.generateNewReauthToken = function(done){
		var that = this;
		crypto.randomBytes(128, function(err, buf){
			if(err) return done(err);

			var token = buf.toString('hex'); //Generate a token
			that.reauthToken = crypto.createHash('sha256').update(token).digest('hex'); //Save the encrypted version
			that.save(function(err, user){
				if(err) return done(err);
				done(null, user, token);
			});
		});
	};

	userSchema.methods.isValidReauthToken = function(token, done){
		//Encrypt given token with same hashing algorithm
		//compare the hashes
		done(true);
	};

	if (mongoose.models.User) {
		return mongoose.model('User');
	} else {
		return mongoose.model('User', userSchema);
	}
};

