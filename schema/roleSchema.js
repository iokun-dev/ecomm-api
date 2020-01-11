let mongoose = require('../node_modules/mongoose');
//var autoIncrement = require('mongoose-auto-increment');
//autoIncrement.initialize(mongoose.connection);

let Schema = mongoose.Schema;
let roleSchema = new Schema
({
    roleId: Number, 
    name: String, 
    RoleDisplayName: String, 
    OrderNo: String, 
    schoolId : Number, 
    branchId : Number,
    isDeleted : {type: Boolean, default: false},
    isActive: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
},
    { collection: 'roles' }
);
// roleSchema.plugin(autoIncrement.plugin, {
//     model: 'roles',
//     field: 'roleId',
//     startAt: 9,
//     incrementBy: 1
// });

let role = mongoose.model('roles', roleSchema);

module.exports = role;
