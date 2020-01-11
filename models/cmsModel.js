let cmsSchema = require('../schema/cmsSchema');
let imageSliderSchema = require('../schema/imageSliderSchema');
let faqSchema = require('../schema/faqSchema');
let logger = require('../config/winston');
let _ = require('lodash');

//-----------------save cms-------------------------
exports.saveCmsContent = (cmsContentInfo, callback) => {
    try {
        if (!_.isEmpty(cmsContentInfo)) {
            let cmsContentInfoData = new cmsSchema(cmsContentInfo);
            cmsContentInfoData.save((err, cmsContentInfoResult) => {
                if (err)
                    callback(true, err);
                else {
                    callback(false, cmsContentInfoResult);
                }
            });
        }
        else {
            callback(true, {});
        }
    }
    catch (err) {
        return;
    }
}

// //-----------------get cms-------------------
exports.getCmsContent = (cmsContentPageTpye, callback) => {
    try {
        if (cmsContentPageTpye) {
            cmsSchema.find({isDeleted: false,pageType:cmsContentPageTpye }, (err, result) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, result);
            }).sort({_id:-1});
        }
        else {
            callback(true, { message: "Error In getting cms Model information" });
        }
    }
    catch (err) {
        return;
    }
}

//-----------------update cms-------------------
exports.updateCmsContent = (cmsContentPageTpye, cmsContentPageData,  callback) => {
    try {
        if (!_.isEmpty(cmsContentPageTpye) && !_.isNull(cmsContentPageData)) {
            cmsSchema.findOneAndUpdate({ 'pageType': cmsContentPageTpye }, { $set: cmsContentPageData},{new:true}, (err, result) => {
                if (err){
                    callback(true, err);
                }
                else {
                    callback(false, result);
                }
            });
        }
        else {
            callback(true, {});
        }
    }
    catch (err) {
        return;
    }
}


//-----------------Save Image Slider Information  -------------------

exports.saveImageSlider = (imageSliderInfo, callback) => {
    try {
        if (imageSliderInfo) {
            let imageSlider = new imageSliderSchema(imageSliderInfo);
            imageSlider.save((err, imageSliderResult) => {
                if (err)
                    callback(true, err);
                else {
                    callback(false, imageSliderResult);
                }
            });
        }
        else {
            callback(true, {});
        }
    }
    catch (err) {
        return;
    }
}

    
//------------------------------- Get Image Slider Information ----------------------------------
exports.getImageSlider = (req, callback) => {
        try {            
            imageSliderSchema.find({isDeleted: false}, (err, result) => {
                    if (err)
                        callback(true, err);
                    else
                        callback(false, result);
                }).sort({_id:-1});
            
        }
        catch (err) {
            return;
        }
    }



    //------------------------------- Get Image Slider Information By Id----------------------------------
exports.getImageSliderById = (sliderId, callback) => {
    try {            
        imageSliderSchema.findOne({'_id':sliderId,isDeleted: false}, (err, result) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, result);
            }).sort({_id:-1});
        
    }
    catch (err) {
        return;
    }
}

    //------------------------------- delete Image Slider Information By Id----------------------------------
    exports.deleteImageSliderById = (sliderId, callback) => {
        try {            
            imageSliderSchema.findOneAndUpdate({'_id':sliderId}, {$set:{isDeleted:true}},{new:true} ,(err, rowResult) => {
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
   

    //----------------update Image Slider Information By Id-------------------
exports.updateImageSliderById = (sliderId,imageSliderData,  callback) => {
    try {
        if (!_.isEmpty(sliderId) && !_.isNull(cmsContentPageData)) {
            cmsSchema.findOneAndUpdate({ '_id': sliderId }, { $set: imageSliderData},{new:true}, (err, result) => {
                if (err){
                    callback(true, err);
                }
                else {
                    callback(false, result);
                }
            });
        }
        else {
            callback(true, {});
        }
    }
    catch (err) {
        return;
    }
}

//-------------------------------Update Image Slider Status----------------------------------

exports.showSliderImage = (sliderId,callback) => {
    try {
        if (sliderId) {
            cmsSchema.findByIdAndUpdate({ '_id': sliderId }, {$set:{isActive:true}},{new:true},(err, result) => {
                if (err){
                    callback(true, err);
                }
                else {
                    callback(false, result);
                }
            });
        }
        else {
            callback(true, {});
        }
    }
    catch (err) {
        return;
    }
}

//-----------------Save FAQ  -------------------

exports.saveFaq = (faqData, callback) => {
    try {
        if (faqData) {
            let faqSch = new faqSchema(faqData);
            faqSch.save((err, faqDataResult) => {
                if (err)
                    callback(true, err);
                else {
                    callback(false, faqDataResult);
                }
            });
        }
        else {
            callback(true, {});
        }
    }
    catch (err) {
        return;
    }
}

    //------------------------------- Get Faq ----------------------------------
    exports.getFaq = (req, callback) => {
        try {            
            faqSchema.find({isDeleted: false}, (err, result) => {
                    if (err)
                        callback(true, err);
                    else
                        callback(false, result);
                }).sort({_id:-1});
            
        }
        catch (err) {
            return;
        }
    }

    //-----------------Save Image Slider Information  -------------------

exports.saveAboutUs = (imageSliderInfo, callback) => {
    try {
        if (imageSliderInfo) {
            let cmsContentInfoData = new cmsSchema(imageSliderInfo);
            cmsContentInfoData.save((err, imageSliderResult) => {
                if (err)
                    callback(true, err);
                else {
                    callback(false, imageSliderResult);
                }
            });
        }
        else {
            callback(true, {});
        }
    }
    catch (err) {
        return;
    }
}
