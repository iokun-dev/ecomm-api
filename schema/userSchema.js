let mongoose = require('../node_modules/mongoose');
let db = require('../config/db-config');
// var autoIncrement = require('mongoose-auto-increment');
// autoIncrement.initialize(mongoose.connection);

let Schema = mongoose.Schema;
let userSchema = new Schema
({
    firstName: {type:String,default:null},
    middleName: {type: String, default:null},
    lastName: {type:String,default:null},
    address: {type:String,default:null},
    state: {type:String,default:null},
    city: {type:String,default:null},
    street: {type:String,default:null},
    houseNumber: {type:String,default:null},
    zip: {type:Number,default:null},
    email: {type:String,default:null},
    image: {type:String,default:null},
    userName: {type:String,default:null},
    phoneNumber: {type:String,default:null},
    password: {type:String,default:null},
    dob: {type:String,default:null},
    bloodGroup: {type:String,default:null},
    gender: {type:String,default:null},
    aadharNumber: {type:String,default:null},
    facebookId:{type:String,default:null},
    twitterId:{type:String,default:null},
    linkedinId:{type:String,default:null},
    dribbleId:{type:String,default:null},
    instagramId : {type:String,default:null},
    biography:{type:String,default:null},
    token:{type:String,default:null},
    frId: {type:String,default:null},
    roleId: {type:Number,default:null},
    subRoleId: {type:String,default:null},
    isActive: { type: Boolean, default: true },
    isBlocked: { type: String, default: "0" },
    isDeleted : {type: Boolean, default: false},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    lastLoggedIn: String,
    remember_token: String,
},
    { collection: 'users' }
);

let user = mongoose.model('users', userSchema);

module.exports = user;
