var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var orderSchema = new mongoose.Schema({
	receiver : {
		firstName : {
			type: String,
			required: true
		},
		lastName : {
			type: String,
			required: true
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
		}
	},
	products : [{
		product : {
			type :  ObjectId,
			ref : "Product",
			required: true
		},
		quantity : {
			type : Number,
			required : true
		},
		price : {
			type : Number,
			required: true
		}
	}],
	created_at : {
		type: Date,
		default: Date.now
	},
	sent : {
		type : Boolean,
		default : false
	}
});

if (mongoose.models.Order) {
	module.exports = mongoose.model('Order');
} else {
	module.exports = mongoose.model('Order', orderSchema);
}