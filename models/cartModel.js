let cartSchema = require('../schema/cartSchema');
let product = require('../schema/productSchema');
let mongoose = require('mongoose');
exports.saveCartProducts = function (cartDoc, callback) {

    var filter ={};
    if(cartDoc.userId!=undefined && cartDoc.userId!=null)
    {
        filter ={ userId: cartDoc.userId ,isDeleted:false};
    }
    else
    {
        filter ={ email: cartDoc.email ,isDeleted:false};
    }

    cartSchema.findOne(filter, (err, carts) => {
        if (err) {
            callback(true, err);
        }
        else {
            if (carts) {
                let flag = true;
                carts.product.sort();
                carts.product.forEach((value, index) => {
                    if (value.productId == cartDoc.productId && value.attrid == cartDoc.attrid) {
                        let myJson = {};
                        myJson.productId = value.productId;
                        myJson.addingDay = value.addingDay;
                        myJson.attrid = value.attrid;
                        myJson.quantity = parseInt(cartDoc.quantity) ;
                        carts.product[index] = myJson;
                        flag = false;
                        value.attrid='';
                    }
                });
                if (flag) {
                    let myJson = {};
                    myJson.productId = cartDoc.productId;
                    myJson.addingDay = cartDoc.addingDay;
                    myJson.attrid = cartDoc.attrid;
                    myJson.quantity = parseInt(cartDoc.quantity);
                    carts.product.push(myJson);
                    cartDoc.attrid='';
                }
                carts.save((err, result) => {
                    if (err) {
                        callback(true, err);
                    }
                    else {
                        callback(false, result);
                    }
                });
            }
            else {
                let cartJson = {};
                let productArr = [];
                cartJson.productId = cartDoc.productId;
                cartJson.addingDay = cartDoc.addingDay;
                cartJson.attrid = cartDoc.attrid;
                cartJson.quantity = parseInt(cartDoc.quantity);
                cartJson.email = cartDoc.email;
                productArr.push(cartJson);
                cartDoc['product'] = productArr;
                let cart = new cartSchema(cartDoc);
                cart.save((err, result) => {
                    if (err) {
                        callback(true, err);
                    }
                    else {
                        cartDoc.attrid='';
                        callback(false, result);
                    }
                });
            }
        }
    });
};

exports.addCartProductsIncrement = function (cartDoc, callback) {
    cartSchema.findOne({ userId: cartDoc.userId ,isDeleted:false}, (err, cartDto) => {
        if (cartDto) {
            let replica = cartDto;
            if(cartDoc.isDelete==true)
            {
                replica.product.forEach((cart, index) => {
                    if (cartDoc.productId === cart.productId) {
                        cartDto.product.splice(index, 1);
                        cartDoc.productId="";                                                
                    }
                });
            }

            else 
            {
            replica.product.forEach((cart, index) => {
                if (cartDoc.productId === cart.productId) {
                    if (cartDoc.verbs === 'add') {
                        let myJson = {};
                        myJson.productId = cart.productId;
                        myJson.addingDay = cart.addingDay;
                        //myJson.quantity = cart.quantity + 1;
                       // cartDto.product.splice(index, 1);
                        myJson.quantity = cart.quantity; //+ 1;
                        cartDto.product.push(myJson);
                        cartDoc.productId="";
                    }
                    else {
                        if (cart.quantity <= 1) {
                            cartDto.product.splice(index, 1);
                        }
                        else {
                            let myJson = {};
                            myJson.productId = cart.productId;
                            myJson.addingDay = cart.addingDay;
                            myJson.quantity = cart.quantity; //- 1;
                            //cartDto.product.splice(index, 1);
                            cartDto.product.push(myJson);
                            cartDoc.productId="";
                        }
                    }
                }
            });
        }
            replica.save((err, result) => {
                if (err) {
                    callback(true, err);
                }
                else {
                    callback(false, result);
                }
            });
        }
        else {
            callback(true, '');
        }
    });
};


//---------------------------------get Cart Products Information---------------------------------------
exports.getCartProducts = (userId, callback) => {

    try {       
        if (userId) {
            cartSchema.aggregate([
                {
                $match:{ "userId": userId ,"isDeleted" : false}},
                {$unwind:"$product"},
                {$project:{pid: {
                        $toObjectId: "$product.productId"
                      },
                    quantity :"$product.quantity" ,
                    attrid :"$product.attrid" ,
                    addingDay :"$product.addingDay" ,
                  
                    userId : userId
                    }},                      
                
                    {
                        $lookup:{
                            from: "product",
                            localField : "pid",
                            foreignField : "_id",
                            as : "productDetils"
                        }
                    },
                         
        
                    {
                    $unwind:"$productDetils"
                     },
                    {$unwind:"$productDetils.productAttribute"},
                     {$project:{  
                     productAttribute: "$productDetils.productAttribute",               
                    attrid:"$productDetils.productAttribute.attrid",
                    attrid1:"$attrid",
                    quantity:"$quantity",
                    productName :"$productDetils.productName" ,
                    skuNumber :"$productDetils.skuNumber" ,                                   
                    userId : "$userId",
                    addingDay : "$addingDay",
                    productId: "$pid"
               }
                     }
                ], (err, result) => {
                if (err) {
                    callback(true, err);
                }
                else {
                    var resultCol=[];
                            result.forEach(function(item){
                           
                                if (item.attrid == item.attrid1){                                   
                                    resultCol.push(item);
                                    }
                                      });
                            callback(false, resultCol);
                   
                }
            });
        }
     }
    catch (err) {
        //logger.error(err);
        return;
    }
}


exports.getCartProductsGuest = (email, callback) => {

    try {       
        if (email) {
            cartSchema.aggregate([
                {
                $match:{ "email": email ,"isDeleted" : false}},
                {$unwind:"$product"},
                {$project:{pid: {
                        $toObjectId: "$product.productId"
                      },
                    quantity :"$product.quantity" ,
                    attrid :"$product.attrid" ,
                    addingDay :"$product.addingDay" ,
                  
                    email : email
                    }},                      
                
                    {
                        $lookup:{
                            from: "product",
                            localField : "pid",
                            foreignField : "_id",
                            as : "productDetils"
                        }
                    },
                         
        
                    {
                    $unwind:"$productDetils"
                     },
                    {$unwind:"$productDetils.productAttribute"},
                     {$project:{  
                     productAttribute: "$productDetils.productAttribute",               
                    attrid:"$productDetils.productAttribute.attrid",
                    attrid1:"$attrid",
                    quantity:"$quantity",
                    productName :"$productDetils.productName" ,
                    skuNumber :"$productDetils.skuNumber" ,                                   
                    email : "$email",
                    addingDay : "$addingDay",
                    productId: "$pid"
               }
                     }
                ], (err, result) => {
                if (err) {
                    callback(true, err);
                }
                else {
                    var resultCol=[];
                            result.forEach(function(item){
                           
                                if (item.attrid == item.attrid1){                                   
                                    resultCol.push(item);
                                    }
                                      });
                            callback(false, resultCol);
                   
                }
            });
        }
     }
    catch (err) {
        //logger.error(err);
        return;
    }
}



//=================================Delete Cart ===============================================
exports.deleteCart = (userId, callback) => {
    try {
        if (userId) {
            cartSchema.update({ 'userId': userId }, { $set: { isDeleted: true } },{multi: true}, (err, result) => {
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
        //logger.error(err);
        return;
    }
}
