let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let lookUpSchema = new Schema
({
    ltype: {type:String,default:false}, 
    lid: {type:String,default:false},
    key: {type:String,default:false}, 
    Value: {type:String,default:false}, 
    ltypeId:{type:String,default:null},
    isDeleted : {type: Boolean, default: false},
    isActive: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
},
    { collection: 'lookup' }
);
let lookUpMaster = mongoose.model('lookup', lookUpSchema);
module.exports = lookUpMaster;