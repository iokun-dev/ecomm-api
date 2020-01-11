let mongoose = require('../node_modules/mongoose');
// var autoIncrement = require('mongoose-auto-increment');
// autoIncrement.initialize(mongoose.connection);

let Schema = mongoose.Schema;
let categorySchema = new Schema
({
    categoryName: String, 
    enableCategory: {type: Boolean, default: true},
    includeInManu: {type: Boolean, default: true}, 
    categoryImage: String, 
    categoryDescription : String, 
    isDeleted : {type: Boolean, default: false},
    isActive: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
},
    { collection: 'category' }
);


let category = mongoose.model('category', categorySchema);

module.exports = category;
