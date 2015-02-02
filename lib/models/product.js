var mongoose = require('mongoose');

var prodSchema = new mongoose.Schema({
	name : {
		type: String,
		required: true
	},
	price : {
		type: Number,
		required: true,
		validate: function(val){
			return val > 0;
		}
	},
	category : {
		type: String,
		required: true
	},
	description : {
		type: String,
		default: "No description"
	},
	deleted : {
		type: Boolean,
		default: false
	}
});

prodSchema.statics.getCategories = function(done){
	this.model('Product').find({deleted: false}).distinct('category', done);
};

if (mongoose.models.Product) {
	module.exports = mongoose.model('Product');
} else {
	module.exports = mongoose.model('Product', prodSchema);
}