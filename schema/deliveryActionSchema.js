let mongoose = require('../node_modules/mongoose');
let Schema = mongoose.Schema;
let deliveryActionSchema = new Schema
({
    key: {type:String,default:false}, 
    value: {type:String,default:false}, 
    isDeleted : {type: Boolean, default: false},
    isActive: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
},
    { collection: 'deliveryAction' }
);
let deliveryAction = mongoose.model('deliveryAction', deliveryActionSchema);
module.exports = deliveryAction;
