let mongoose = require('../node_modules/mongoose');
let Schema = mongoose.Schema;
let productSchema = new Schema
({
	productEnable:{type:Boolean,default:true},
    attributeName: {type:String,default:false}, 
    productName: {type:String,default:false}, 
    skuNumber: {type:String,default:false},
    //isFeatured:{type:Boolean,default:false},
    productPrice: {type:String,default:false}, 
    taxClass : {type:String,default:false},    
    quantity: {type:String,default:false}, 
    stockStatus: {type:String,default:false},
    productWeight: {type:String,default:false}, 
    productCategory: [], 
    productType: [], 
    productSubCategory:[],
    productSubSubCategory:[],
    productVisibility : {type:String,default:false},    
    productNewFromDate: {type:String,default:false}, 
    productNewToDate: {type:String,default:false}, 
    countryManufacture: {type:String,default:false}, 
    expectedDeliveryDate:{type:String,default:false},
    productDetailsDescription : {type:String,default:false},
    productShortDescription: {type:String,default:false}, 
    productAttribute:[],
    brandId : Schema.Types.ObjectId,
    isDeleted : {type: Boolean, default: false},
    isActive: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
},
    { collection: 'product' }
);
let product = mongoose.model('product', productSchema);
module.exports = product;
