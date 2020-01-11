let product = require('../schema/productSchema');
let deliveryActionSchema = require('../schema/deliveryActionSchema');
let lookUpSchema = require('../schema/lookUpSchema');
let logger = require('../config/winston');
let _ = require('lodash');

//-----------------save Product -------------------
exports.saveProduct = (productInfo, callback) => {
    try {
        if (!_.isEmpty(productInfo)) {
            productInfo.expectedDeliveryDate = '';
            let productSchema = new product(productInfo);
            productSchema.save((err, productResult) => {
                if (err)
                    callback(true, err);
                else {
                    // let academicDto = filterdAcademicSession(result);
                    callback(false, productResult);
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

//-----------------get Product -------------------
exports.getProductsDetail = (productType, callback) =>{
    try{
        if(productType && productType != ''){
           var type=[];
           type.push(productType);        
            product.find({isDeleted:false, isActive: true, productType: {$in: type}}, (err, products) => {
                if(err){
                    callback(true, err);
                }
                else{
                    callback(false, products);
                }
            });
        }else{
            product.find({isDeleted:false, isActive: true}, (err, products) => {
                if(err){
                    callback(true, err);
                }
                else{
                    callback(false, products);
                }
            });
        }
    }
    catch(err){
        callback(true, "")
    }
}

//----------------------------------------------get search Product ---------------------------------

exports.getSearchProducts = (filterVal,callback) => {
    try {
        if (filterVal) {
            // product.find({ "productCategory._id":{ $in: [filterVal.productCategory]},"productSubCategory._id":{ $in: [filterVal.productSubCategory]},"productSubSubCategory._id":{ $in: [filterVal.productSubSubCategory]}, isDeleted: false }, (err, result) => {
            product.find({ "productCategory._id":{ $in: [filterVal.productCategory]},"productSubCategory._id":{ $in: [filterVal.productSubCategory]},"productSubSubCategory._id":{ $in: [filterVal.productSubSubCategory]}, isDeleted: false }, (err, result) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, result);
            });
            //.sort({_id:-1});
        }
        else {
            callback(true, { message: "Error in getting product details" });
        }
    }
    catch (err) {
        //logger.error(err);
        return;
    }
}


//----------------------------------------------get Filter Product ---------------------------------

exports.getFilterOnProducts = (filterVal,callback) => {
    try {
        if (filterVal) {
            product.find({ "productCategory.productGender":{ productPrice: { $lte: filterVal}}, isDeleted: false }, (err, result) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, result);
            });
            //.sort({_id:-1});
        }
        else {
            callback(true, { message: "Error in getting product details" });
        }
    }
    catch (err) {
        //logger.error(err);
        return;
    }
}

//----------------------------------------------get Filter Product ---------------------------------

exports.getPriceFilterOnProducts = (filterVal,callback) => {
    try {

        if (filterVal) {
            product.find({ "productCategory.productGender":{ productPrice: { $lte: filterVal}}, isDeleted: false }, (err, result) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, result);
            });
            //.sort({_id:-1});
        }
        else {
            callback(true, { message: "Error in getting product details" });
        }
    }
    catch (err) {
        //logger.error(err);
        return;
    }
}



// //-----------------delete product-------------------
exports.deleteProduct = (productId, callback) => {
    try {
        if (!_.isNull(productId)) {
            product.findByIdAndUpdate({ '_id': productId }, { $set: { isDeleted: true } },{new:true}, (err, result) => {
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
//----------------------------------- Product Payment Process-----------------------------------

exports.productPayment = (productInfo, callback) => {
    try {
        if (!_.isEmpty(productInfo)) {
                    const payment = {
                        "intent": "authorize",
                    "payer": {
                    "payment_method": "paypal"
                    },
                    "redirect_urls": {
                    "return_url": "return url",
                    "cancel_url": "cancel url"
                    },
                    "transactions": [{
                    "amount": {
                    "total": productInfo.productPrice,
                    "currency": "USD"
                    },
                    "description": "PayPal payment description"
                    }]
                    };
/* Creating Paypal Payment for Paypal starts */
		paypal.payment.create(payment, function (error, payment) {
			if (error) {
				console.log(error);
			} else {
		    	if(payment.payer.payment_method === 'paypal') {
		    		response.paymentId = payment.id;
		    		var redirectUrl;
		    		response.payment = payment;
		    		for(var i=0; i < payment.links.length; i++) {
		    			var link = payment.links[i];
		    			if (link.method === 'REDIRECT') {
		    				redirectUrl = link.href;
		    			}
		    		}
		    		response.redirectUrl = redirectUrl;
		    	}
		    }
		    /* 
		    * Sending Back Paypal Payment response 
		    */
		    callback(error,response);
		});

            // let productSchema = new product(productInfo);
            // productSchema.save((err, productResult) => {
            //     if (err)
            //         callback(true, err);
            //     else {
            //         // let academicDto = filterdAcademicSession(result);
            //         callback(false, productResult);
            //     }
            // });
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

//------------------------------------Get response on success payment --------------------

exports.execute = (req,callback) => {
    sessionInfo = req.session;	
		var response = {};
		const PayerID = req.query.PayerID;
		if (typeof sessionInfo.sessionData == "undefined" || sessionInfo.sessionData=="") {
			res.redirect("/");
			res.end();
		} else{
			sessionInfo.state ="success";
			helper.getResponse(sessionInfo,PayerID,function(response) {
				res.render('executePayement',{
					response : response
				});
			});
		};
}

//------------------------------------Get response on cancel payment --------------------

exports.cancel = (req,callback) => {
    sessionInfo = req.session;
    if (typeof sessionInfo.sessionData == "undefined" || sessionInfo.sessionData=="") {
        res.redirect("/");
        res.end();
    } else{
        var response ={};
        response.error = true;
        response.message = "Payment unsuccessful.";
        response.userData = {
            name : sessionInfo.sessionData.name
        };
                        
        res.render('executePayement',{
            response : response
        });
    }
}
//------------------------------------Get delivery Action List--------------------

exports.deliveryAction = (req,callback) => {
    try {
        deliveryActionSchema.find({}, (err, result) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, result);
            });

    }
    catch (err) {
        //logger.error(err);
        return;
    }
}

//---------------------------------Get Product Update --------------------
//-----------------update Attribute-------------------
exports.updateProduct = (productId, productVal, callback) => {
    try {
        if (!_.isEmpty(productId) && !_.isNull(productVal)) {
            product.findByIdAndUpdate({ '_id': productId }, { $set: productVal},{new:true}, (err, result) => {
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


//------------------------------------Get Product Details By Id --------------------
exports.getProductDetailsById = (productId, callback) => {
    try {
        if (!_.isEmpty(productId) ) {
            product.findOne({ '_id': productId }, {isDeleted:false},{new:true}, (err, result) => {
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

//------------------------------------Get lookup List--------------------

exports.lookupDetails = (req,callback) => {
    try {
        lookUpSchema.find({}, (err, result) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, result);
            });

    }
    catch (err) {
        //logger.error(err);
        return;
    }
}


//------------------------------------Get Lookup  List Details--------------------

exports.lookupFilterData = (ltype,callback) => {
    try {
        lookUpSchema.find({ltype:ltype,isDeleted:false}, (err, result) => {
            //lookUpSchema.find({ ltype:ltype},(err,result) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, result);
            });

    }
    catch (err) {
        //logger.error(err);
        return;
    }
}


//------------------------------------Get Lookup  List Details Row Data--------------------

exports.lookupFilterRowData = (lookUpId,callback) => {
    try {
        lookUpSchema.findOne({'_id':lookUpId},{ltype:1,key:1,Value:1,lid:1},{new:true} ,(err, rowResult) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, rowResult);
            });

    }
    catch (err) {
        //logger.error(err);
        return;
    }
}


//------------------------------------Update Lookup  List Details Row Data--------------------

exports.UpdateLookupFilterRowData = (lookUpId,lookUpData,callback) => {
    try {
        lookUpSchema.findByIdAndUpdate({'_id':lookUpId}, {$set:lookUpData},{new:true} ,(err, rowResult) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, rowResult);
            });

    }
    catch (err) {
        //logger.error(err);
        return;
    }
}



//------------------------------------Delete Lookup  List Details Row Data--------------------

exports.DeleteLookupFilterRowData = (lookUpId,callback) => {
    try {
        lookUpSchema.findOneAndUpdate({'_id':lookUpId}, {$set:{isDeleted:true}},{new:true} ,(err, rowResult) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, rowResult);
            });

    }
    catch (err) {
        //logger.error(err);
        return;
    }
}

//------------------------------------Lookup details filter Data--------------------
exports.lookupDetailsFilter = (req,callback) => {
    try {
        //lookUpSchema.distinct({"ltype"},(err, rowResult) => {
            lookUpSchema.distinct('ltype',(err, rowResult) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, rowResult);
            });

    }
    catch (err) {
        //logger.error(err);
        return;
    }
}

//------------------------------------save new lookup data details-------------------
exports.saveLookupDetails = (req, callback) => {
    try {
        if (req) {
            let ltype = req.body.ltype; 
            var data = req.body;
            var lId = '';
            var order = '';
           // lookUpSchema.findOne({'ltype':ltype}.sort({ "_id":-1}) ,(err, rowResult) => {
                lookUpSchema.findOne({'ltype':ltype} ,(err, rowResult) => {
                lId = parseInt(rowResult.lid) + parseInt(1);
                order = parseInt(rowResult.order) + parseInt(1);
               
            });  
            data.lid = lId;
            data.order = order;        
            let lookUp = new lookUpSchema(data);
            lookUp.save((err, dataResult) => {
                if (err)
                    callback(true, err);
                else {
                    // let academicDto = filterdAcademicSession(result);
                    callback(false, dataResult);
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

//------------------------------------get lookup state-------------------
exports.lookupStateList = (req,callback) => {
    try {
        lookUpSchema.find({ltype:"State",isDeleted:false} ,(err, rowResult) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, rowResult);
            });

    }
    catch (err) {
        //logger.error(err);
        return;
    }
}

//------------------------------------Get Product Data Using search sku Number--------------------
exports.getSearchProductsSkuNumber = (filterVal,callback) => {
    try {
        if (filterVal) {            
            product.findOne({"skuNumber":filterVal, isDeleted: false }, (err, result) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, result);
            });
        }
        else {
            callback(true, { message: "Error in getting product details" });
        }
    }
    catch (err) {
        return;
    }
}
