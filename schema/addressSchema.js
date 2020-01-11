let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let addressSchema = new Schema
    ({
        "userId" : String,
        "firstName" : String,
		"lastName": String,
		"email" : String,
		"company" : String,
		"address": String,
		"address2": String,
		"phone": String,
		"city": String,
		"state": String,
		"zip": String,
		"country": String,
		"fax": String,
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now }
    }, { collection: 'address' });

let address = mongoose.model('address', addressSchema);

module.exports = address;
