let mongoose = require('../node_modules/mongoose');

let Schema = mongoose.Schema;
let subCategorySchema = new Schema
({
    categoryId: Schema.Types.ObjectId,
    subCategoryName: String, 
    enableSubCategory: {type: Boolean, default: true},
    includeInManu: {type: Boolean, default: true}, 
    subCategoryImage: String, 
    subCategoryDescription : String, 
    isDeleted : {type: Boolean, default: false},
    isActive: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
},
    { collection: 'subCategory' }
);

let subCategory = mongoose.model('subCategory', subCategorySchema);

module.exports = subCategory;
