let mongoose = require('../node_modules/mongoose');
let Schema = mongoose.Schema;
let contactUsSchema = new Schema
({
    name: {type :String, default:null},
    surName: {type:String, default:null},
    email: { type:String,default:null},
    email: { type:String,default:null},
    message: { type:String,default:null},
   
},
    { collection: 'contactUs' }
);
let contactUs = mongoose.model('contactUs', contactUsSchema);

module.exports = contactUs;
