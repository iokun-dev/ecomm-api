let attribute = require('../schema/attributeSchema');
let logger = require('../config/winston');
let _ = require('lodash');

//-----------------save session-------------------------
exports.saveProductAttribute = (productAttributeInfo, callback) => {
    try {
        if (!_.isEmpty(productAttributeInfo)) {
            let productAttribute = new attribute(productAttributeInfo);
            productAttribute.save((err, productAttributeResult) => {
                if (err)
                    callback(true, err);
                else {
                    // let academicDto = filterdAcademicSession(result);
                    callback(false, productAttributeResult);
                }
            });
        }
        else {
            callback(true, {});
        }
    }
    catch (err) {
        //logger.error(err);
        return;
    }
}

// //-----------------get session-------------------
exports.getProductAttribute = (req, callback) => {
    try {
        if (req) {
            attribute.find({isDeleted: false }, (err, result) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, result);
            }).sort({_id:-1});
        }
        else {
            callback(true, { message: "Error in Product Attribute information" });
        }
    }
    catch (err) {
        //logger.error(err);
        return;
    }
}

//-----------------update Attribute-------------------
exports.updateProductAttribute = (productAttributeId, productAttributeVal, callback) => {
    try {
        if (!_.isEmpty(productAttributeId) && !_.isNull(productAttributeVal)) {
            attribute.findByIdAndUpdate({ '_id': productAttributeId }, { $set: productAttributeVal},{new:true}, (err, result) => {
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
        //logger.error(err);
        return;
    }
}

// //-----------------delete attribute-------------------
exports.deleteProductAttribute = (productAttributeId, callback) => {
    try {
        if (!_.isNull(productAttributeId)) {
            attribute.findByIdAndUpdate({ '_id': productAttributeId }, { $set: { isDeleted: true } },{new:true}, (err, result) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, result);
            });
        }
        else {
            callback(true, {});
        }
    }
    catch (err) {
        logger.error(err);
        return;
    }
}


// //-------------- Get Product attribute using id---------------------------------
exports.getAttributeInfoById = (productAttributeId, callback) => {
    try {
        if (productAttributeId) {
            attribute.findOne({ '_id': productAttributeId },  { isDeleted: false } , (err, result) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, result);
            });
        }
        else {
            callback(true, {});
        }
    }
    catch (err) {
        logger.error(err);
        return;
    }
}
