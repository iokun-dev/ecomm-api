let jwt = require('jsonwebtoken');
let myToken = require('./token');
let userModel = require('./../models/userModel');
let logger = require('../config/winston')

//create token
exports.creatAppToken = (data, callback) => {
    userModel.login(data, (err, userObj) => {
        if (err) {
            callback(true, err);
        }
        else {
            if (userObj !== null) {
                let token = jwt.sign({ email: userObj.email, userName: userObj.userName, _id: userObj._id }, myToken.secret);
                let paramObj = {};
                paramObj.token = token;
                paramObj.data = userObj;
                paramObj.data.token = token;
                callback(false, paramObj);
            }
            else
            callback(true, {});
        }
    });
};

exports.creatUserAppToken = (data, callback) => {
    userModel.userLogin(data, (err, userObj) => {
        if (err) {
            callback(true, err);
        }
        else {
            if (userObj !== null) {
                let token = jwt.sign({ email: userObj.email, userName: userObj.userName, _id: userObj._id }, myToken.secret);
                let paramObj = {};
                paramObj.token = token;
                paramObj.data = userObj;
                paramObj.data.token = token;
                callback(false, paramObj);
            }
            else
            callback(true, {});
        }
    });
};
//verify token
exports.verifyAppToken = (token,callback) => {
    jwt.verify(token, myToken.secret, function (err, decoded) {
        if (err) {
            callback(true)
        }
        else {
             if (decoded) {
                callback(false, decoded)
               
            }
        }
    });
}