let userModel = require('../models/userModel');
let jwt = require('../config/auth');
let fs = require('fs');
let path = require('path');
let imagUploadConfig = require('../config/imageUpload');
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "user",
        pass: "pass"
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.sendmail=(req,res)=>{
    const mailOptions = {
        from: 'from', // sender address
        to: req.body.email, // list of receivers
        subject: 'Io send this message', // Subject line
        // html: `<h1>You have successfully done your booking </h1>`// plain text body
        html:req.body.html

    }
    transporter.sendMail(mailOptions, function (error, sent) {
        console.log("mailOptions===>",mailOptions);
            if (error) {
                res.status(400).json({success:false,message:error})
            } else {
                console.log(sent);
                res.status(200).json({success:true,message:"Email sent on your email",sent})
            }
        })
}
//-------------- Get Image -------
exports.getFileRead = (req, res, next) => {
    fs.stat('./uploads/' + req.query.filename, function (err, stats) {
        if (stats) {
            res.sendFile(path.resolve('./uploads/' + req.query.filename));
        }
        else {
            res.sendStatus(404);
        }
    });
}

//Change password
exports.userChangePassword = (req, res) => {
    let userInfo = req.body;    
    userModel.changePassword(userInfo, (err, userInfoResult) => {
        if (err) {
            res.status(400).json({ success: false, message: "Error, In saving user password !" });
        }
        else {
            let newPassword = userInfo.password;
            const mailOptions = {
                from: 'from', // sender address
                to: req.body.email, // list of receivers
                subject: 'Io send this message', // Subject line
                html: `<p>Your password changed successfully. Your new password is ${newPassword}. </p>`// plain text body
                // html:req.body.html
        
            }
            transporter.sendMail(mailOptions, function (error, sent) {
                console.log("mailOptions===>",mailOptions);
                    if (error) {
                        res.status(400).json({success:false,message:error})
                    } else {
                        console.log(sent);
                        res.status(200).json({success:true,message:"Email sent on your email",sent,userInfoResult})
                    }
                })
            // res.status(200).json({ success: true, message: "user password changed successfully" });

        }
    });
}

//---------------------- User Registration process --------------------------
exports.userRegistration = (req, res) => {
    let userInfo = req.body;
        userInfo.roleId = 4;
            userModel.userRegistration(userInfo, (err, userInfoResult) => {
                if (err) {
                    logger.error(err);
                    res.status(400).json({ success: false, message: "Error, In saving user Information !" });
                }
                else {
                    if(userInfoResult==1){
                        res.status(200).json({ success: true, message: "This email is already in use ",data:userInfoResult});    
                    }else{
                    res.status(200).json({ success: true, message: "user registration done successfully", data: userInfoResult });
                    }
                }
            });
        }

// //-------------- Get all user list---------------------------------
exports.getUserList = (req, res) => {
    userModel.getUserList(req,(err,userList) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In getting  user list!" })
        }
        else {
            let message = userList.length > 0 ? "user list get successfully" : "user not found";
            res.status(200).json({ success: true, message: message, data: userList });
        }
    });
};


// //-------------- Update user-registration Information ---------

exports.updateUserRegistration = (req, res) => {
    let userId = req.query.userId;
    let userInfo = req.body;
    //let productInfo = req.body;
    let token = req.headers.token;
    // jwt.verifyAppToken(token, (err, tokenResult) => {
    //     if (err) {
    //         res.status(401).json({ message: "unauthorize User !" });
    //     }
    //      else {
    //         imagUploadConfig.upload(req, res,'user_',(err, userInfo) => {
    //             if (err) {
    //                 res.status(400).json({ success: false, message: "Error while saving post detail!" });
    //             }else{
    userModel.updateUserRegistration(userId, userInfo, (err, userUpdateData) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In updating user information !" })
        }
        else {
            if(userUpdateData==1){
                res.status(200).json({ success: true, message: "This email is already in use ",data:userUpdateData});    
            }else{
            res.status(200).json({ success: true, message: "User information update successfully", data: userUpdateData });
            }
        }
    });

};


// //-------------- Get academic-course Information ---------

exports.userRoleList = (req, res) => {
    userModel.userRoleList(req,(err, userRoleList) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In getting user role list!" })
        }
        else {
            let message = userRoleList.length > 0 ? "User List get successfully" : "User List not found";
            res.status(200).json({ success: true, message: message, data: userRoleList });
        }
    });
};


// //-------------- Delete user Information ---------

exports.deleteUser = (req, res) => {
    let userId = req.query.userId
    userModel.deleteUser(userId, (err, userInfoResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In Deleting User information !" })
        }
        else {
            res.status(200).json({ success: true, message: "User information delete successfully", data: userInfoResult });
        }
    });
};

// //-------------- User Login-------
exports.userLogin = (req, res) => {
    let userInfo = req.body;
    jwt.creatUserAppToken(userInfo, (err, token) => {
        if (err)
            res.status(401).json({ success: false, message: "unauthorize User !" });
        else {
            res.status(200).json({ success: true, message: "login successfully.", data: token.data, success: true });
        }
    });
};

