let productModel = require('../models/productModel');
let imagUploadConfig = require('../config/imageUpload');
const multer = require('multer');
const fs = require('fs');
let path = require('path');
const shortid = require('shortid');
const uploadDir = 'uploads/';
var imageArray=[];
//var Promise = require('promise');
let jwt = require('../config/auth');
//-------------- Save Product Information -------

//------config for Product Image upload------
var storageMultipleFile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // file.fileSize;
        // req.files[0].size;
        if (file.mimetype !== "application/octet-stream") {
            let fileName = file.originalname.split(".");
           // imge = "product" + '_' + Date.now() +"_"+fileName[0]+ '.' + fileName[1];
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

exports.saveProduct = (req, res) => {
    let token = req.headers.token;
    //let productInfo = req.body;

    jwt.verifyAppToken(token, (err, tokenResult) => {
        if (err) {
            res.status(401).json({ message: "unauthorize User !" });
        }
        else {
            uploadMultipleFile(req, res, function (err) {
                var fileData = req.files;
                
                console.log(fileData);
                var productInfo = JSON.parse( req.body.bodyObject);
                productInfo.productAttribute.forEach(function (attr)
                {
			var productImg = [];
                        fileData.forEach(function(item){
                           
                if (item.filename.includes(attr.id)){
                    attr.attrid =shortid.generate();
                    productImg.push(item.filename);
                    }
                      });
                     // attr.productImages = productImg;
                      attr.image = productImg;
                })               
                
                 
                  
                //var productData = JSON.stringify(productInfo);
                productModel.saveProduct(productInfo, (err, productResult) => {
                    if (err) {
                        logger.error(err);
                        res.status(400).json({ success: false, message: "Error, In saving Product Information !" });
                    }
                    else {
                        res.status(200).json({ success: true, message: "Product Information saved successfully", data: productResult });
                    }
                });
            })
                }
            });
        }
//     });
// };
// //-------------- Get Product Information ---------
/* var verifyToken = new Promise(function(resolve, reject){
    jwt.verifyAppToken(token, (err, tokenResult) => {

    });
 }) */
function verifyToken(token) {
    return new Promise(function (resolve, reject) {
        // Do async job
        jwt.verifyAppToken(token, (err, tokenResult) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(tokenResult);
            }
        });
    });
};
function getProducts() {
    return new Promise(function (resolve, reject) {
        productModel.getProductsDetail((err, products) => {
            if (err) {
                reject(err);
            } else {
                resolve(products);
            }
        });
    });
};

exports.getProductsDetail = (req, res) => {
    var productType = req.query.type;
    productModel.getProductsDetail(productType,(err, productResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In getting products details !!" });
        }
        else {
            if(productResult.length > 0){
                res.status(200).json({ success: true, message: "Product information", data: productResult });
            }else{
                res.status(200).json({ success: true, message: "No Product Found" });
            }

          
        }
    });
};
//------------------------------------Get Product Data Using search--------------------

exports.getSearchProducts = (req, res) => {
    let filterVal = req.query;
    productModel.getSearchProducts(filterVal, (err, searchResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In getting Product Information !" });
        }
        else {

            res.status(200).json({ success: true, message: "Product Information get successfully", data: searchResult });
        }
    });
};

//------------------------------------Get Product Data Using search sku Number--------------------

exports.getSearchProductsSkuNumber = (req, res) => {
    let skunumber = req.query.skunumber;
    productModel.getSearchProductsSkuNumber(skunumber, (err, searchResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In getting Product Information !" });
        }
        else {

            res.status(200).json({ success: true, message: "Product Information get successfully", data: searchResult });
        }
    });
};
//------------------------------------Get Product Data Using Filters--------------------

exports.getFilterOnProducts = (req, res) => {
    let filterVal = req.headers;

            productModel.getFilterOnProducts(filterVal, (err, filterResult) => {
                if (err) {
                    logger.error(err);
                    res.status(400).json({ success: false, message: "Error, In getting Product Information !" });
                }
                else {
                    
                    res.status(200).json({ success: true, message: "Product Information get successfully", data: filterResult });
                }
            });
};
//------------------------------------Delete Product Data --------------------
exports.deleteProduct = (req, res) => {
    let productId = req.query.productId;
    productModel.deleteProduct(productId, (err, productResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In Deleting Product information !" })
        }
        else {
            res.status(200).json({ success: true, message: "product sub Category Deleted", data: productResult});
        }
    });
};
//------------------------------------Get Product Data Using prices Filters--------------------

exports.getPriceFilterOnProducts = (req, res) => {
    let filterVal = req.headers;
            productModel.getPriceFilterOnProducts(filterVal, (err, filterResult) => {
                if (err) {
                    logger.error(err);
                    res.status(400).json({ success: false, message: "Error, In getting Product Information !" });
                }
                else {
                    
                    res.status(200).json({ success: true, message: "Product Information get successfully", data: filterResult });
                }
            });
};

//----------------------------------- Product Payment Process-----------------------------------
exports.productPayment = (req, res) => {
    let token = req.headers.token;
    let productInfo = req.body;

    jwt.verifyAppToken(token, (err, tokenResult) => {
        if (err) {
            res.status(401).json({ message: "unauthorize User !" });
        }
        else {
            productModel.productPayment(productInfo, (err, productPaymentResult) => {
                if (err) {
                    logger.error(err);
                    res.status(400).json({ success: false, message: "Error, In Payment Process !" });
                }
                else {
                    
                    res.status(200).json({ success: true, message: "Product payment successfully", data: productPaymentResult });
                }
            });
        }
    });
//}
// });
}

//------------------------------------Get response on success payment --------------------

exports.execute = (req, res) => {
            productModel.execute(req, (err, paymentResult) => {
                if (err) {
                    logger.error(err);
                    res.status(400).json({ success: false, message: "Error, In getting Product Information !" });
                }
                else {
                    
                    res.status(200).json({ success: true, message: "Product Information get successfully", data: paymentResult });
                }
            });
};



//------------------------------------Get response on cancel payment --------------------

exports.cancel = (req, res) => {
        productModel.cancel(req, (err, paymentResult) => {
                if (err) {
                    logger.error(err);
                    res.status(400).json({ success: false, message: "Error, In getting Product Information !" });
                }
                else {
                    
                    res.status(200).json({ success: true, message: "Product Information get successfully", data: paymentResult });
                }
            });

};


//-----------------update product--------------------------------------------------

exports.updateProduct = (req, res) => {
    //update Files
    // req.files;
    // req.files.size;
        uploadMultipleFile(req, res, function (err) {
            var fileData = req.files;
            req.body.bodyObject;
            
            var productInfo = JSON.parse( req.body.bodyObject);
            //var
            //var productInfo = req.body.bodyObject;
            productInfo.productAttribute.forEach(function (attr)
            {
        var productImg = [];
                    fileData.forEach(function(item){
                       
            if (item.filename.includes(attr.id)){
                attr.attrid =shortid.generate();
                productImg.push(item.filename);
                }
                  });
                  attr.image = productImg;
            })
            let productId = req.query.productId;
            let productVal = req.body;
            productModel.updateProduct(productId, productInfo, (err, productResult) => {
                if (err) {
                    logger.error(err);
                    res.status(400).json({ success: false, message: "Error, In updating Product information !" })
                }
                else {
                    res.status(200).json({ success: true, message: "Product update successfully", data: productResult});
                }
            });
        })

};

//------------------------------------Get delivery Action List--------------------

exports.deliveryAction = (req, res) => {
    productModel.deliveryAction(req, (err, deliveryActionResult) => {
            if (err) {
                logger.error(err);
                res.status(400).json({ success: false, message: "Error, In getting List !" });
            }
            else {
                
                res.status(200).json({ success: true, message: "Delivery List get successfully", data: deliveryActionResult });
            }
        });

};

//------------------------------------Get Product Details By Id --------------------

exports.getProductDetailsById = (req, res) => {
    var productId = req.query.productId;
    productModel.getProductDetailsById(productId, (err, productDetailsResult) => {
            if (err) {
                logger.error(err);
                res.status(400).json({ success: false, message: "Error, In getting Product Information !" });
            }
            else {
                
                res.status(200).json({ success: true, message: "Product Information get successfully", data: productDetailsResult });
            }
        });

};


//------------------------------------Update product List after product delivered--------------------

exports.productListUpdate = (req, res) => {
    let productId = req.query.productId;
    let productSize = req.query.productSize;
    productModel.productListUpdate(productId,productSize, (err, updateResult) => {
            if (err) {
                logger.error(err);
                res.status(400).json({ success: false, message: "Error, In while updating List !" });
            }
            else {
                
                res.status(200).json({ success: true, message: "Product List Updated successfully", data: updateResult});
            }
        });

};

//------------------------------------Get Lookup List--------------------

exports.lookupDetails = (req, res) => {
    productModel.lookupDetails(req, (err, lookupDetailsResult) => {
            if (err) {
                //logger.error(err);
                res.status(400).json({ success: false, message: "Error, In getting List !" });
            }
            else {
                
                res.status(200).json({ success: true, message: "Look up List get successfully", data: lookupDetailsResult });
            }
        });

};

//------------------------------------Get Lookup  List Details--------------------

exports.lookupFilterData = (req, res) => {
    var ltype = req.query.ltype;
    productModel.lookupFilterData(ltype, (err, lookupDetailsResult) => {
            if (err) {
                //logger.error(err);
                res.status(400).json({ success: false, message: "Error, In getting List !" });
            }
            else {
                
                res.status(200).json({ success: true, message: "Look up List get successfully", data: lookupDetailsResult });
            }
        });

};

//------------------------------------Get Lookup  List Details Row Data--------------------

exports.lookupFilterRowData = (req, res) => {
    // var ltype = req.query.ltype;
    // var lid = req.query.lid;
    var lookUpId = req.query.lookUpId; 
    productModel.lookupFilterRowData(lookUpId,(err, lookupDetailsResult) => {
            if (err) {
                logger.error(err);
                res.status(400).json({ success: false, message: "Error, In getting List !" });
            }
            else {
                
                res.status(200).json({ success: true, message: "Look up List get successfully", data: lookupDetailsResult });
            }
        });

};

//------------------------------------Update Lookup  List Details Row Data--------------------

exports.UpdateLookupFilterRowData = (req, res) => {
    var lookUpId = req.query.lookUpId; 
    var lookUpData = req.body;
    productModel.UpdateLookupFilterRowData(lookUpId,lookUpData,(err, lookupDetailsResult) => {
            if (err) {
                //logger.error(err);
                res.status(400).json({ success: false, message: "Error, In Updating List !" });
            }
            else {
                
                res.status(200).json({ success: true, message: "Look up List updated successfully", data: lookupDetailsResult });
            }
        });

};
//------------------------------------Delete Lookup  List Details Row Data--------------------

exports.DeleteLookupFilterRowData = (req, res) => {
    var lookUpId = req.query.lookUpId; 
    productModel.DeleteLookupFilterRowData(lookUpId,(err, lookupDetailsResult) => {
            if (err) {
                logger.error(err);
                res.status(400).json({ success: false, message: "Error, In Updating List !" });
            }
            else {
                
                res.status(200).json({ success: true, message: "Look up List updated successfully", data: lookupDetailsResult });
            }
        });

};

//------------------------------------Lookup details filter Data--------------------

exports.lookupDetailsFilter = (req, res) => {
    productModel.lookupDetailsFilter(req,(err, lookupDetailsResult) => {
            if (err) {
                //logger.error(err);
                res.status(400).json({ success: false, message: "Error, In getting List !" });
            }
            else {
                
                res.status(200).json({ success: true, message: "Look up List get successfully", data: lookupDetailsResult });
            }
        });

};

//------------------------------------save-lookup-details-------------------

exports.saveLookupDetails = (req, res) => {
    productModel.saveLookupDetails(req,(err, lookupDetailsResult) => {
            if (err) {
                //logger.error(err);
                res.status(400).json({ success: false, message: "Error, In getting List !" });
            }
            else {
                
                res.status(200).json({ success: true, message: "Look up List get successfully", data: lookupDetailsResult });
            }
        });

};

//------------------------------------get lookup states-------------------

exports.lookupStateList = (req, res) => {
    productModel.lookupStateList(req,(err, lookupDetailsResult) => {
            if (err) {
                //logger.error(err);
                res.status(400).json({ success: false, message: "Error, In getting List !" });
            }
            else {
                
                res.status(200).json({ success: true, message: "Look up List get successfully", data: lookupDetailsResult });
            }
        });

};


//------------------------------------Update Image Slider Data --------------------

exports.UpdateLookupFilterRowData = (req, res) => {
    var lookUpId = req.query.lookUpId; 
    var lookUpData = req.body;
    productModel.UpdateLookupFilterRowData(lookUpId,lookUpData,(err, lookupDetailsResult) => {
            if (err) {
                //logger.error(err);
                res.status(400).json({ success: false, message: "Error, In Updating List !" });
            }
            else {
                
                res.status(200).json({ success: true, message: "Look up List updated successfully", data: lookupDetailsResult });
            }
        });

};

