let cmsModel = require('../models/cmsModel');
let cmsSchema = require('../schema/cmsSchema');
let contactUsSchema = require('../schema/contactUsSchema');

let jwt = require('../config/auth');
let logger = require('../config/winston');
let multer = require('multer');
const fs = require('fs');
let path = require('path');
const shortid = require('shortid');
const nodemailer = require('nodemailer');

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
const uploadDir = 'uploads/';
var imageArray=[];

var storageMulter = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './uploads/');
    },
    filename: function (request, file, callback) {

        fs.stat('./uploads/' + file.originalname, function (err, stats) {
            if (stats) {
                var fileArr = file.originalname.split("."); // to get the file extension
                var fileName = file.originalname.replace("." + fileArr[fileArr.length - 1], ""); // get the file name
                callback(null, fileName + "" + parseInt(Math.random() * 10000000000) + "." + fileArr[fileArr.length - 1]); //save the file with new name in case of duplicate data
            }
            else {
                callback(null, file.originalname);
            }
        });
    }
});

var uploadCmsFile = multer({ storage: storageMulter }).single('file');




//-------------- Save CMS Content Information -------
exports.saveCmsContent = (req, res) => {

    uploadCmsFile(req, res, function (err) {
        if (err) {
            logger.error(err);
        }
        else{
            let cmsContentInfo = JSON.parse(req.body.cmsObj);
            if(req.file!=null && req.file.filename!=null) cmsContentInfo.imageUrl=req.file.filename;
            else cmsContentInfo.imageUrl='';
            cmsModel.saveCmsContent(cmsContentInfo, (err, cmsContentInfoResult) => {
                if (err) {
                    logger.error(err);
                    res.status(400).json({ success: false, message: "Error, In saving cms Model information !" });
                }
                else {                    
                    res.status(200).json({ success: true, message: "cms Model information saved successfully", data: cmsContentInfoResult });
                }
            });
        }
    });
};
exports.saveCmsWithoutImage = (req, res) => {
    cmsSchema.update({ "pageType": req.body.pageType }, {
        $set: {
            pageHeading: req.body.pageHeading,
            pageContentDescription: req.body.pageContentDescription,
            metaSeoTitle: req.body.metaSeoTitle,
            metaSeoDescription: req.body.metaSeoDescription,
            isDeleted: false,
            isActive:false
        }
    }, { upsert: true }, (err, succ) => {
        if (err) {
            res.status(404).json({ success: false, message: err });
        }
        else if (!succ) {
            res.status(400).json({ success: 404, message: "Not success" })
        }
        else {
            res.status(200).json({ success: true, message: "Data found Successfully", data: succ });

        }
    })
}
// //-------------- Get CMS Content Information ---------
exports.getCmsContent = (req, res) => {
    let cmsContentPageTpye = req.query.pageType;
    cmsModel.getCmsContent(cmsContentPageTpye, (err, cmsContentInfoResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({success: false, message: "Error, In getting cms Model information !"})
        }
        else {
            let message = cmsContentInfoResult.length > 0 ? "cms Model information get successfully" : "cms Model information not found";
            res.status(200).json({ success: true, message: message, data: cmsContentInfoResult });
        }
    });
};
exports.getCmsContentNew=(req,res)=>{
    cmsSchema.find({pageType:req.query.pageType},(err,succ)=>{
        if(err){
            res.status(404).json({ success: false, message: err });
        }
        else if (!succ) {
            res.status(400).json({ success: 404, message: "Not success" })
        }
        else {
            res.status(200).json({ success: true, message: "Data found Successfully", data: succ });

        }
    })
}

/// contact us save api ////

exports.saveContactUs=(req,res)=>{
    contactUsSchemaData=new contactUsSchema({
        name:req.body.name,
        surName:req.body.surName,
        email:req.body.email,
        message:req.body.message
    })
    contactUsSchemaData.save((err,succ)=>{
        if(err){
            res.status(404).json({ success: false, message: err });
        }
        else if (!succ) {
            res.status(400).json({ success: 404, message: "Not success" })
        }
        else{
            const mailOptions = {
                from: 'enter from', // sender address
                to: "enter to", // list of receivers 
                subject: 'For Inquiry', // Subject line
                // html: `<h1>You have successfully done your booking </h1>`// plain text body
                html:req.body.html
            }
            transporter.sendMail(mailOptions, function (error, sent) {
                console.log("mailOptions===>",mailOptions);
                    if (error) {
                        res.status(400).json({success:false,message:error})
                    } else {
                        res.status(200).json({success:true,message:"Email sent on your email",data:succ,sent})
                    }
                })
        }
    })
}
// //-------------- Update Product Attribute Information ---------
exports.updateCmsContent = (req, res) => {
    let cmsContentPageTpye = req.query.pageType;
    let cmsContentPageData = req.body;
    cmsModel.updateCmsContent(cmsContentPageTpye, cmsContentPageData, (err, cmsContentInfoResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message:  "Error, In Updating cms Model information !" })
        }
        else {
            res.status(200).json({ success: true, message: "cms Model information Updated successfully", data: cmsContentInfoResult});
        }
    });
};


//-------------- Save Image Slider Information -------


//------config for Image upload------
var storageMultipleFile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        if (file.mimetype !== "application/octet-stream") {
            let fileName = file.originalname.split(".");
           imge = fileName[0]+ '.' + fileName[1];
            imageArray.push(imge);
            cb(null, imge);
        }
        else {
            c.push(file.originalname);
            cb(null, file.originalname + "1");
        }
    }
});
var uploadMultipleFile = multer({ storage: storageMultipleFile }).array('files');//For multiple file
exports.saveImageSlider = (req, res) => {

            uploadMultipleFile(req, res, function (err) {
                var fileData = req.files;
                var fileName = fileData[0].filename;                
                var imageSliderData = JSON.parse(req.body.bodyObject);
                if(fileName){
                    imageSliderData.sliderImage = fileName;
                }
                cmsModel.saveImageSlider(imageSliderData, (err, imageSliderResult) => {
                    if (err) {
                        logger.error(err);
                        res.status(400).json({ success: false, message: "Error, In saving Image slider Information !" });
                    }
                    else {
                        res.status(200).json({ success: true, message: "Image Slider Information saved successfully", data: imageSliderResult });
                    }
                });
            })
    }


    
//------------------------------- Get Image Slider Information ----------------------------------
exports.getImageSlider = (req, res) => {
    cmsModel.getImageSlider(req, (err, imageSliderResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({success: false, message: "Error, In getting Image slider information !"})
        }
        else {
            let message = imageSliderResult.length > 0 ? "Image slider information get successfully" : "Image slider information not found";
            res.status(200).json({ success: true, message: message, data: imageSliderResult});
        }
    });
};

    
//------------------------------- Get Image Slider Information By Id----------------------------------
exports.getImageSliderById = (req, res) => {
    let sliderId = req.query.sliderId;
    cmsModel.getImageSliderById(sliderId, (err, imageSliderResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({success: false, message: "Error, In getting Image slider information !"})
        }
        else {
            let message = imageSliderResult.length > 0 ? "Image slider information get successfully" : "Image slider information not found";
            res.status(200).json({ success: true, message: message, data: imageSliderResult});
        }
    });
};

//------------------------------- delete Image Slider Information By Id----------------------------------
exports.deleteImageSliderById = (req, res) => {
    let sliderId = req.query.sliderId;
    cmsModel.deleteImageSliderById(sliderId, (err, imageSliderResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({success: false, message: "Error, In deleting Image slider information !"})
        }
        else {
            let message = imageSliderResult.length > 0 ? "Image slider information deleted successfully" : "Image slider information not found";
            res.status(200).json({ success: true, message: message, data: imageSliderResult});
        }
    });
};


//------------------------------- update Image Slider Information By Id----------------------------------

var storageMultipleFile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        if (file.mimetype !== "application/octet-stream") {
            let fileName = file.originalname.split(".");
           imge = fileName[0]+ '.' + fileName[1];
            imageArray.push(imge);
            cb(null, imge);
        }
        else {
            c.push(file.originalname);
            cb(null, file.originalname + "1");
        }
    }
});
var uploadMultipleFile = multer({ storage: storageMultipleFile }).array('files');//For multiple file
exports.updateImageSliderById = (req, res) => {
    let sliderId = req.query.sliderId;
            uploadMultipleFile(req, res, function (err) {
                var fileData = req.files;
                var fileName = fileData[0].filename;                
                var imageSliderData = JSON.parse(req.body.bodyObject);
                if(fileName){
                    imageSliderData.sliderImage = fileName;
                }
                cmsModel.updateImageSliderById(sliderId,imageSliderData, (err, imageSliderResult) => {
                    if (err) {
                        logger.error(err);
                        res.status(400).json({ success: false, message: "Error, In updating Image slider Information !" });
                    }
                    else {
                        res.status(200).json({ success: true, message: "Image Slider Information updated successfully", data: imageSliderResult });
                    }
                });
            })
    }

//-------------------------------Update Image Slider Status----------------------------------

exports.showSliderImage = (req, res) => {
    let sliderId = req.query.sliderId;
    cmsModel.showSliderImage(sliderId, (err, imageSliderResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({success: false, message: "Error, In updating Image slider information !"})
        }
        else {
           // let message = imageSliderResult.length > 0 ? "Image slider information updated successfully" : "Image slider information not found";
           let message = "Image slider information updated successfully";
            res.status(200).json({ success: true, message: message, data: imageSliderResult});
        }
    });
};

//-------------------------------Save FAQ---------------------------------
exports.saveFaq = (req, res) => {

    let faq = [];
    let faqData = {};
    faqData.faq = req.body.data;
    cmsModel.saveFaq(faqData, (err, faqDataResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({success: false, message: "Error, In Saving Data !"})
        }
        else {           
            let message = "Faq data saved successfully";
            res.status(200).json({ success: true, message: message, data: faqDataResult});
        }
    });
};


//-------------------------------GET FAQ---------------------------------
exports.getFaq = (req, res) => {
    cmsModel.getFaq(req, (err, faqDataResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({success: false, message: "Error, In Getting Data !"})
        }
        else {           
            let message = "Faq data get successfully";
            res.status(200).json({ success: true, message: message, data: faqDataResult});
        }
    });
};



//------config for Image upload------
var storageMultipleFile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        if (file.mimetype !== "application/octet-stream") {
            let fileName = file.originalname.split(".");
           imge = fileName[0]+ '.' + fileName[1];
            imageArray.push(imge);
            cb(null, imge);
        }
        else {
            c.push(file.originalname);
            cb(null, file.originalname + "1");
        }
    }
});
var uploadMultipleFile = multer({ storage: storageMultipleFile }).array('files');//For multiple file
exports.saveAboutUs = (req, res) => {

            uploadMultipleFile(req, res, function (err) {
                var fileData = req.files;
                var fileName = fileData[0].filename;                
                var imageSliderData = JSON.parse(req.body.bodyObject);
                if(fileName){
                    imageSliderData.imageUrl = fileName;
                }
                cmsModel.saveAboutUs(imageSliderData, (err, imageSliderResult) => {
                    if (err) {
                        logger.error(err);
                        res.status(400).json({ success: false, message: "Error, In saving Image slider Information !" });
                    }
                    else {
                        res.status(200).json({ success: true, message: "Image Slider Information saved successfully", data: imageSliderResult });
                    }
                });
            })
    }


