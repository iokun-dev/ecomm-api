let categoryModel = require('../models/categoryModel');
let jwt = require('../config/auth');
//-------------- Save Product-Category Information -------
exports.saveProductCategory = (req, res) => {
    let token = req.headers.token;
    let productCategoryInfo = req.body;
    // jwt.verifyAppToken(token, (err, tokenResult) => {
    //     if (err) {
    //         res.status(401).json({ message: "unauthorize User !" });
    //     } else {
            categoryModel.saveCategoryAttribute(productCategoryInfo, (err, productCategoryResult) => {
                if (err) {
                    logger.error(err);
                    res.status(400).json({ success: false, message: "Error, In saving Product Category information !" });
                }
                else {
                    res.status(200).json({ success: true, message: "Product Category information saved successfully", data: productCategoryResult });
                }

        //     });
        // }
    });
};

//-------------- Get Product-Category Information -------
exports.getProductCategory = (req, res) => {
    
    categoryModel.getProductCategory(req, (err, productCategoryResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In getting Product Category information !" })
        }
        else {
            let message = productCategoryResult.length > 0 ? "Product category information get successfully" : "Product category information not found";
            res.status(200).json({ success: true, message: message, data: productCategoryResult });
        }
    });
};


//-------------- Save Product sub Category Information -------
exports.saveProductSubCategory = (req, res) => {
    let token = req.headers.token;
    let productSubCategoryInfo = req.body;
    // jwt.verifyAppToken(token, (err, tokenResult) => {
        // if (err) {
            // res.status(401).json({ message: "unauthorize User !" });
        // } else {
            categoryModel.saveSubCategoryAttribute(productSubCategoryInfo, (err, productSubCategoryResult) => {
                if (err) {
                    //logger.error(err);
                    res.status(400).json({ success: false, message: "Error, In saving Product Sub Category information !" });
                }
                else {
                    res.status(200).json({ success: true, message: "Product Sub Category information saved successfully", data: productSubCategoryResult });
                }

            });
       // }
    //});
};

//-------------- Get Product sub Category Information -------
exports.getProductSubCategory = (req, res) => {    
    categoryModel.getProductSubCategory(req, (err, productSubCategoryResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In getting Product Sub Category information !" })
        }
        else {
            let message = productSubCategoryResult.length > 0 ? "Product sub category information get successfully" : "Product sub category information not found";
            res.status(200).json({ success: true, message: message, data: productSubCategoryResult });
        }
    });
};

// //-------------- Update Product Category Information ---------

exports.updateProductCategory = (req, res) => {
    let productCategoryId = req.query.categoryId;
    let productCategoryVal = req.body;
    categoryModel.updateProductCategory(productCategoryId, productCategoryVal, (err, productCategoryResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In updating Product category information !" })
        }
        else {
            res.status(200).json({ success: true, message: "Product category information update successfully", data: productCategoryResult});
        }
    });
};

// //-------------- Delete Product Category Information ---------

exports.deleteProductCategory = (req, res) => {
    let productCategoryId = req.query.categoryId;
    categoryModel.deleteProductCategory(productCategoryId, (err, productCategoryResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In Deleting Product Category information !" })
        }
        else {
            res.status(200).json({ success: true, message: "Product Category Deleted", data: productCategoryResult });
        }
    });
};

// //-------------- Update Product Sub Category Information ---------

exports.updateProductSubCategory = (req, res) => {
    let subCategoryId = req.query.subCategoryId;
    let productSubCategoryVal = req.body;
    categoryModel.updateProductSubCategory(subCategoryId, productSubCategoryVal, (err, productSubCategoryResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In updating Product subcategory information !" })
        }
        else {
            res.status(200).json({ success: true, message: "Product subcategory information update successfully", data: productSubCategoryResult});
        }
    });
};

// //-------------- Delete Product Sub Category Information ---------

exports.deleteProductSubCategory = (req, res) => {
    let productSubCategoryId = req.query.subCategoryId;
    categoryModel.deleteProductSubCategory(productSubCategoryId, (err, productSubCategoryResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In Deleting Product sub Category information !" })
        }
        else {
            res.status(200).json({ success: true, message: "product sub Category Deleted", data: productSubCategoryResult});
        }
    });
};

//-------------- Save Product Sub sub Category Information -------
exports.saveProductSubSubCategory = (req, res) => {
    //let token = req.headers.token;
    let productSubSubCategoryInfo = req.body;
    // jwt.verifyAppToken(token, (err, tokenResult) => {
        // if (err) {
            // res.status(401).json({ message: "unauthorize User !" });
        // } else {
            categoryModel.saveProductSubSubCategory(productSubSubCategoryInfo, (err, productSubSubCategoryResult) => {
                if (err) {
                    //logger.error(err);
                    res.status(400).json({ success: false, message: "Error, In saving Product Sub Category information !" });
                }
                else {
                    res.status(200).json({ success: true, message: "Product Sub Category information saved successfully", data: productSubSubCategoryResult });
                }

            });
       // }
    //});
};

//-------------- Get Product Sub Sub Category Information -------
exports.getProductSubSubCategory = (req, res) => {    
    categoryModel.getProductSubSubCategory(req, (err, productSubSubCategoryResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In getting Product Sub Sub Category information !" })
        }
        else {
            let message = productSubSubCategoryResult.length > 0 ? "Product sub category information get successfully" : "Product Sub Sub Category information not found";
            res.status(200).json({ success: true, message: message, data: productSubSubCategoryResult });
        }
    });
};
