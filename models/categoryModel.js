let category = require('../schema/categorySchema');
let subcategory = require('../schema/subCategorySchema');
let subsubcategory = require('../schema/subSubCategorySchema');
let logger = require('../config/winston');
let _ = require('lodash');
let mongoose = require('mongoose');
//-----------------save Product Catgory-------------------
exports.saveCategoryAttribute = (productCategoryInfo, callback) => {
    try {
        if (!_.isEmpty(productCategoryInfo)) {
            let productCategory = new category(productCategoryInfo);
            productCategory.save((err, productCategoryResult) => {
                if (err)
                    callback(true, err);
                else {
                    // let academicDto = filterdAcademicSession(result);
                    callback(false, productCategoryResult);
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


//-----------------get Product-Category Information-------------------
exports.getProductCategory = (req, callback) => {
    try {
        if (req) {
            category.find({ isDeleted: false }, (err, result) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, result);
            }).sort({_id:-1});
        }
        else {
            callback(true, { message: "Error in getting Product-Category Information" });
        }
    }
    catch (err) {
        logger.error(err);
        return;
    }
}



//-----------------save Product Sub category-------------------
exports.saveSubCategoryAttribute = (productSubCategoryInfo, callback) => {
    try {
        if (!_.isEmpty(productSubCategoryInfo)) {
            let productSubcategory = new subcategory(productSubCategoryInfo);
            productSubcategory.save((err, productSubCategoryResult) => {
                if (err)
                    callback(true, err);
                else {
                    // let academicDto = filterdAcademicSession(result);
                    callback(false, productSubCategoryResult);
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


//-----------------get Product-Category Information-------------------
exports.getProductSubCategory = (req, callback) => {
    try {
        categoryId = req.query.categoryId;
        if (categoryId) {

            subcategory.aggregate([
                {
                    $match: { categoryId: mongoose.Types.ObjectId(categoryId), isDeleted: false }
                },
                {
                    $lookup: {
                        from: "category",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "categoryDetails"
                    }
                },
                {
                    $unwind:  { path: "$categoryDetails" }
                },
                {
                    $project: {
                        categoryName: "$categoryDetails.categoryName" ,
                        subCategoryName: "$subCategoryName",
                        subCategoryDescription:"$subCategoryDescription",
                        enableSubCategory:"$enableSubCategory",
                        includeInManu:"$includeInManu",
                        subCategoryDescription:"$subCategoryDescription",
                        parentId:"$categoryId"

                    }
                }
            ], (err, result) => {
                if (err) {
                    callback(true, err);
                }
                else {
                    callback(false, result);
                }
            });
        }
        else {
            subcategory.find({ isDeleted: false }, (err, result) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, result);
            }).sort({_id:-1});

           // callback(true, { message: "Error in getting sub category data" });
        }
    }
    catch (err) {
        //logger.error(err);
        return;
    }
}

//-----------------update category-------------------
exports.updateProductCategory = (productCategoryId, productCategoryVal, callback) => {
    try {
        if (!_.isEmpty(productCategoryId) && !_.isNull(productCategoryVal)) {
            category.findByIdAndUpdate({ '_id': productCategoryId }, { $set: productCategoryVal},{new:true}, (err, result) => {
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
        logger.error(err);
        return;
    }
}

// //-----------------delete category-------------------
exports.deleteProductCategory = (productCategoryId, callback) => {
    try {
        if (!_.isNull(productCategoryId)) {
            category.findByIdAndUpdate({ '_id': productCategoryId }, { $set: { isDeleted: true } },{new:true}, (err, result) => {
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


//-----------------update product sub category-------------------
exports.updateProductSubCategory = (subCategoryId, productSubCategoryVal, callback) => {
    try {
        if (!_.isEmpty(subCategoryId) && !_.isNull(productSubCategoryVal)) {
            subcategory.findByIdAndUpdate({ '_id': subCategoryId }, { $set: productSubCategoryVal},{new:true}, (err, result) => {
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
        logger.error(err);
        return;
    }
}

// //-----------------delete product sub category-------------------
exports.deleteProductSubCategory = (productSubCategoryId, callback) => {
    try {
        if (!_.isNull(productSubCategoryId)) {
            subcategory.findByIdAndUpdate({ '_id': productSubCategoryId }, { $set: { isDeleted: true } },{new:true}, (err, result) => {
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


//-----------------save Product SUb Sub category-------------------
exports.saveProductSubSubCategory = (productSubSubCategoryInfo, callback) => {
    try {
        if (!_.isEmpty(productSubSubCategoryInfo)) {
            let newproductsubSubcategory = new subsubcategory(productSubSubCategoryInfo);
            newproductsubSubcategory.save((err, productSubCategoryResult) => {
                if (err)
                    callback(true, err);
                else {
                    // let academicDto = filterdAcademicSession(result);
                    callback(false, productSubCategoryResult);
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

//-----------------get Product Sub Sub Category Information-------------------
exports.getProductSubSubCategory = (req, callback) => {
    try {
        if (req) {
            subsubcategory.find({ isDeleted: false }, (err, result) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, result);
            }).sort({_id:-1});
        }
        else {
            callback(true, { message: "Error in getting Product Sub Sub Category Information" });
        }
    }
    catch (err) {
        logger.error(err);
        return;
    }
}