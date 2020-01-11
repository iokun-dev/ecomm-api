let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let billaddressSchema = new Schema
    ({
        "userId" : String,
        "firstName" : String,
		"lastName": String,
		"email" : String,
		"address": String,
		"address2": String,
		"phone": String,
		"city": String,
		"state": String,
        "zip": String,
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now }
    }, { collection: 'billaddress' });

let billaddress = mongoose.model('billaddress', billaddressSchema);

module.exports = billaddress;
