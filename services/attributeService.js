let attributeModel = require('../models/attributeModel');
let jwt = require('../config/auth');
let logger = require('../config/winston')
//-------------- Save Product-Attribute Information -------
exports.saveProductAttribute = (req, res) => {
    let token = req.headers.token;
    let productAttributeInfo = req.body;

    jwt.verifyAppToken(token, (err, tokenResult) => {
        if (err) {
            res.status(401).json({ message: "unauthorize User !" });
        } else {
            attributeModel.saveProductAttribute(productAttributeInfo, (err, productAttributeResult) => {
                if (err) {
                    logger.error(err);
                    res.status(400).json({ success: false, message: "Error, In saving Product Attribute information !" });
                }
                else {
                    
                    res.status(200).json({ success: true, message: "Product Attribute information saved successfully", data: productAttributeResult });
                }
            });
        }
    });
};

// //-------------- Get  Product Attribute Information ---------
exports.getProductAttribute = (req, res) => {
    attributeModel.getProductAttribute(req, (err, attributeResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({success: false, message: "Error, In getting Product Attribute information !"})
        }
        else {
            let message = attributeResult.length > 0 ? "Product Attribute information get successfully" : "Product Attribute information not found";
            res.status(200).json({ success: true, message: message, data: attributeResult });
        }
    });
};

// //-------------- Update Product Attribute Information ---------

exports.updateProductAttribute = (req, res) => {
    let productAttributeId = req.query.attributeId;
    let productAttributeVal = req.body;
    attributeModel.updateProductAttribute(productAttributeId, productAttributeVal, (err, productAttributeResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In updating Product Attribute information !" })
        }
        else {
            res.status(200).json({ success: true, message: "Product Attribute information update successfully", data: productAttributeResult});
        }
    });
};

// //-------------- Delete Product Attribute Information ---------

exports.deleteProductAttribute = (req, res) => {
    let productAttributeId = req.query.attributeId;
    attributeModel.deleteProductAttribute(productAttributeId, (err, productAttributeResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In Deleting Attribute information !" })
        }
        else {
            res.status(200).json({ success: true, message: "Attribute information Deleted", data: productAttributeResult });
        }
    });
};


// //-------------- Get all Batch list using course id---------------------------------
exports.getAttributeInfoById = (req, res) => {
    let productAttributeId = req.query.attributeId;
    attributeModel.getAttributeInfoById(productAttributeId,(err, productAttributeRes) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In getting  information !" })
        }
        else {
            let message = productAttributeRes.length > 0 ? "Information get successfully" : "Information not found";
            res.status(200).json({ success: true, message: message, data: productAttributeRes });
        }
    });
};
