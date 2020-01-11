let mongoose = require('../node_modules/mongoose');

let Schema = mongoose.Schema;
let subSubCategorySchema = new Schema
({
    categoryId: Schema.Types.ObjectId,
    subCategoryId: Schema.Types.ObjectId,
    subSubCategoryName: String, 
    enablesubSubCategory: {type: Boolean, default: true},
    includeInManu: {type: Boolean, default: true}, 
    subSubCategoryImage: String, 
    subSubCategoryDescription : String, 
    isDeleted : {type: Boolean, default: false},
    isActive: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
},
    { collection: 'subSubCategory' }
);

let subSubCategory = mongoose.model('subSubCategory', subSubCategorySchema);

module.exports = subSubCategory;