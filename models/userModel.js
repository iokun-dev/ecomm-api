let user = require('../schema/userSchema');
let role = require('../schema/roleSchema');
let logger = require('../config/winston');
let async = require('async');
let _ = require('lodash');

//------------admin login---------------
exports.login = async (userLogin, callback) => {
    try {
        let loginUser = await user.findOne({ email: userLogin.email.toLowerCase(), password: userLogin.password,roleId:{$nin: [3, 4]} ,isDeleted:false, isActive:true }).exec();
        if (!_.isEmpty(loginUser)) {
            callback(false, loginUser);
        }
        else {
            callback(true, {});
        }
    }
    catch (err) {
        logger.error(err);
        return;
    }
};

//Change password

exports.changePassword = async (userinfo, callback) => {
    var  email= userinfo.email;
    var  newpassword= userinfo.password;
    try {      

        let loginUser = await user.findOne({ email: email.toLowerCase(), isActive:true }).exec();
        if (_.isEmpty(loginUser)) {
            callback(true, loginUser);
        }
        else {
            user.findByIdAndUpdate({ '_id': loginUser.id}, { $set:{'password': newpassword }},{new:true}, (err, userInfoResult) => {
                if (err)
                    callback(true, err);
                else {
                    callback(false, {});
                }
            });
        }
    }
    catch (err) {
        // logger.error(err);
        return;
    }
};



//------------user login---------------
exports.userLogin = async (userLogin, callback) => {
    try {
        let loginUser = await user.findOne({ email: userLogin.email.toLowerCase(), password: userLogin.password,isDeleted:false, isActive:true, roleId: { $ne: 1 }  }).exec();
        if (!_.isEmpty(loginUser)) {
            callback(false, loginUser);
        }
        else {
            callback(true, {});
        }
    }
    catch (err) {
        logger.error(err);
        return;
    }
};
//-------------------------------------user Registration-----------------------------------
exports.userRegistration = (userInfo, callback) => {
    try {
        if (!_.isEmpty(userInfo)) {           
            user.findOne({ email:userInfo.email,isDeleted:false},(err,userEmail) => {
                if(err){
                    callback(true,err);
                }
                else if(userEmail){
                    callback(false,userEmail=1);
                }
                // else {
                //     if(userEmail){
                //         callback(false,userEmail=1)
                //     }
                    else{
                        let userSchema = new user(userInfo);
                        userSchema.save((err, userRegistrationResult) => {
                            if (err)
                                callback(true, err);
                            else {
                                // let academicDto = filterdAcademicSession(result);
                                callback(false, userRegistrationResult);
                            }
                        });
                    }
                   
                    // }
                });
            } else {
                callback(true, {});
            } 
        } 
    catch (err) {
        //logger.error(err);
        return;
    }
}

// //-----------------update user profile-------------------
exports.updateUserRegistration = (userId, userInfoData, callback) => {
    try {
        if (!_.isEmpty(userId) && !_.isNull(userInfoData)) {
                        user.findByIdAndUpdate({ '_id': userId }, { $set: userInfoData },{new:true}, (err, userInfoResult) => {
                            if (err)
                                callback(true, err);
                            else {
                                 callback(false, userInfoResult);
                            }
                        });
                    }   
    
        else {
            callback(true, {});
        }
    }
    catch (err) {
       // logger.error(err);
        return;
    }
}
//=================================== User List =================================

exports.getUserList = function (req, callback) {
    try {
        //user.find({  roleId:{$ne:1} , isDeleted:false}, (err, userList) => {
        user.find({isDeleted:false}, (err, userList) => {
            if (err) {
                callback(true, err);
            }
            else {
                callback(false, userList);
            }
        });
        
    }
    catch (err) {
        logger.error(err);
        return;
    }
};


//==================================User Role List===================================
exports.userRoleList = function (req, callback) {
    try {
        role.find({isDeleted:false }, (err, userList) => {
            if (err) {
                callback(true, err);
            }
            else {
                callback(false, userList);
            }
        });
        
    }
    catch (err) {
        logger.error(err);
        return;
    }
};

//------------------------------- delete user Information By Id----------------------------------
    exports.deleteUser = (userId, callback) => {
        try {            
            user.findOneAndUpdate({'_id':userId}, {$set:{isDeleted:true}},{new:true} ,(err, rowResult) => {
                    if (err)
                        callback(true, err);
                    else
                        callback(false, rowResult);
                });
            
        }
        catch (err) {
            return;
        }
    }
