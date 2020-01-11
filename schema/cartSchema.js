let mongoose = require('../node_modules/mongoose');

let Schema = mongoose.Schema;
let cartSchema = new Schema
({
    userId: String,
    attrid:String,
    product: Array,
    isDeleted : {type: Boolean, default: false},
    isActive: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    email : {type:String,default:""}
},
    { collection: 'cart' }
);


let cart = mongoose.model('cart', cartSchema);

module.exports = cart;
