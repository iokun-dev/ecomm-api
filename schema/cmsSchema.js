let mongoose = require('../node_modules/mongoose');
let Schema = mongoose.Schema;
let cmsSchema = new Schema
({
    pageHeading: {type :String, default:null},
    pageContentDescription: {type:String, default:null},
    pageType: { type:String,default:null},
    metaSeoTitle : {type:String,default:null}, 
    metaSeoDescription : {type :String,default:null},
    imageUrl : {type:String,default:false},
    isDeleted : {type: Boolean, default: false},
    isActive: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
},
    { collection: 'cms' }
);
let cms = mongoose.model('cms', cmsSchema);

module.exports = cms;
