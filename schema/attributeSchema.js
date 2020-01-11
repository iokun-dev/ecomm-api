let mongoose = require('../node_modules/mongoose');
// var autoIncrement = require('mongoose-auto-increment');
// autoIncrement.initialize(mongoose.connection);

let Schema = mongoose.Schema;
let attributeSchema = new Schema
({
    attributeName: String, 
    attributeFieldType: String, 
    attributeRequired: {type: Boolean, default: true}, 
    attributeCode: String, 
    attributeScope : String, 
    attributeDefaultValue : String,
    attributeUniqueValue : String,
    attributeValues:{type:Array,default:null},
    isDeleted : {type: Boolean, default: false},
    isActive: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
},
    { collection: 'attribute' }
);
// attributeSchema.plugin(autoIncrement.plugin, {
//     model: 'roles',
//     field: 'roleId',
//     startAt: 9,
//     incrementBy: 1
// });

let attribute = mongoose.model('attribute', attributeSchema);

module.exports = attribute;
