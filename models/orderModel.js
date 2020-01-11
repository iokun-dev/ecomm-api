let orderSchema = require('../schema/orderSchema');
let address = require('../schema/addressSchema');
let billaddress = require('../schema/billaddressSchema');
let cartSchema = require('../schema/cartSchema');
let product = require('../schema/productSchema');
//let paypal = require('../config/paypal-config');
const paypal = require('paypal-rest-sdk');
var dateFormat = require('dateformat');
var now = new Date();
// paypal.configure({

// });

// var config = {
//     "port" : 5000,
//     "api" : {
//       "host" : "api.sandbox.paypal.com",
//       'mode':'sandbox',
//       'client_id':'AeIlUIrk7WBbtBq1twB1vswdTCsv7VqdLEtQZdaA6QqsdJdR8HI_Ig_reVrnWTdMZnRNtykRMWjVpwiW',
//       'client_secret':'EJMflwS90S0ru7FepYLJN-QFHIzWCLyNr9zilgARqolq4LtvQlRJa8kMKlZ5HpR60O0qlatKDxDpjcFZ'
//     }
// }
// paypal.configure(config.api);


// paypal auth configuration
var config = {
    "port" : 5000,
    "api" : {
      "host" : "api.sandbox.paypal.com",
      "port" : "",            
      "client_id" : "enter client id", // "AeIlUIrk7WBbtBq1twB1vswdTCsv7VqdLEtQZdaA6QqsdJdR8HI_Ig_reVrnWTdMZnRNtykRMWjVpwiW",  // your paypal application client id
      
      "client_secret" : "enter client secret"//"EJMflwS90S0ru7FepYLJN-QFHIzWCLyNr9zilgARqolq4LtvQlRJa8kMKlZ5HpR60O0qlatKDxDpjcFZ" // your paypal application secret id
    }
  }
  paypal.configure(config.api);

function makeOrderNo(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

function addDays(n){
    var t = new Date();
    t.setDate(t.getDate() + n); 
    var month = "0"+(t.getMonth()+1);
    var date = "0"+t.getDate();
    month = month.slice(-2);
    date = date.slice(-2);
     var date = date +"/"+month +"/"+t.getFullYear();
   // alert(date);
}


exports.saveOrder = function (order, callback) {
    let orderNo = makeOrderNo(13);
    order.orderNo = '0' + orderNo;
    // let aattrid = "TdnW4h80K";
    // let productId = "5d52be099487e30e6cb7dac0";
    // let quantity = 4;
    let orders = new orderSchema(order);
    var response ={};
    orders.save((err, orderResult) => {
        if (err) {
            callback(true, err);
        }else{
            // product.findOneAndUpdate({ '_id': productId , "productAttribute.attrid":aattrid }, { $addToSet:{"productAttribute:{quantity":6}},{new:true}, (err, result) => {
            //     if (err){
            //         callback(true, err);
            //     }
               
            // });
            callback(false, orderResult);
        }

        // else {
        //     var sessionInfo = {};
        //     sessionInfo.paypalData='';
        //     sessionInfo.clientData='';
        //     var dataVal = {
        //         price:10,
        //         productId:'5d495a4c4dc22c0cc0051bf6',
        //         productName:'Jeans'
        //     }
        //     const data ={
		// 		userID :"5d2c9108bcef091c945f849f",
		// 		data : dataVal
		// 	}
        //         /*
        //         * call to paynow helper method to call paypal sdk
        //         */
        //         payNow(data,function(error,result){
        //             if(error){
        //                 res.writeHead(200, {'Content-Type': 'text/plain'});
        //                 res.end(JSON.stringify(error));
        //             }else{
        //                 sessionInfo.paypalData = result;
        //                 sessionInfo.clientData = data;
        //                 callback(error,result.redirectUrl);
        //                 //res.redirect(result.redirectUrl);
        //             }				
        //         });			
        //    // }
        // }
    });
};

/* ---- for paypal payment gateway ---*/

exports.payNow=function(paymentData,callback){
    var response ={};

    /* Creating Payment JSON for Paypal starts */
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
                "total": paymentData.netTotal,
                "currency": "USD"
            },
            "description": paymentData.products[0].name
        }]
    };
    /* Creating Payment JSON for Paypal ends */

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
    /* Creating Paypal Payment for Paypal ends */		
}


exports.getResponse=function(data,PayerID,callback){

    var response = {};
    
    const serverAmount = parseFloat(data.paypalData.payment.transactions[0].amount.total);
    const clientAmount = parseFloat(data.clientData.netTotal);
    const paymentId = data.paypalData.paymentId;
    const details = {
        "payer_id": PayerID 
    };

    response.userData= {
        userID : data.userId,
        name : data.fullName
    };

    if (serverAmount !== clientAmount) {
        response.error = true;
        response.message = "Payment amount doesn't matched.";
        callback(response);
    } else{
        
        paypal.payment.execute(paymentId, details, function (error, payment) {
            if (error) {
                console.log(error);
                response.error = false;
                response.message = "Payment Successful.";
                callback(response);
            } else {

                /*
                * inserting paypal Payment in DB
                */

                const insertPayment={
                    userId : data.userId,
                    paymentId : paymentId,
                    createTime : payment.create_time,
                    state : payment.state,
                    currency : "USD",
                    amount: serverAmount,
                    createAt : new Date().toISOString()
                }

                self.insertPayment(insertPayment,function(result){

                    if(! result.isPaymentAdded){
                        response.error = true;
                        response.message = "Payment Successful, but not stored.";
                        callback(response);
                    }else{
                        response.error = false;
                        response.message = "Payment Successful.";
                        callback(response);
                    };
                });
            };
        });
    };
}

/*---- paypal ends here ----*/

//---------------------------------get Orders Products Information---------------------------------------
exports.getOrders = (userId, callback) => {
    try {       
        if (userId) {
            orderSchema.aggregate([
                {
                $match:{ "userId": userId }},
                    {
                        $lookup:{
                            from: "product",
                            localField : "products._id",
                            foreignField : "_id",
                            as : "productDetils"
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
     }
    catch (err) {
        //logger.error(err);
        return;
    }
}

exports.dispatchOrder = function (status, orderNo, callback) {
    orderSchema.findOne({ orderNo: orderNo }, (err, ordersObj) => {
        if (err) {
            callback(true, err);
        }
        else {
            ordersObj.status = status;
            if (ordersObj.status === 'delivered') {
                ordersObj.paid = ordersObj.totalAmount;
                ordersObj.isPaid = true;
            }
            ordersObj.save((err, result) => {
                if (err) {
                    callback(true, err);
                }
                else {
                    callback(false, result);
                }
            });
        }
    });
};

exports.getExistAddress = function (userId, callback) {
    address.findOne({ "userId": userId }, (err, userAddress) => {
        if (err) {
            callback(true, err);
        }
        else {
            callback(false, userAddress);
        }
    });
};

//get guest ship address
exports.guestShipAddress = function (guestId, callback) {
    address.findOne({ email: guestId }, (err, userAddress) => {
        if (err) {
            callback(true, err);
        }
        else {
            callback(false, userAddress);
        }
    });
};

//save address
exports.saveAddress = function (addDoc, callback) {

address.findOne({"email": addDoc.email},(err,res)=>{
    if(err)
    {
        callback(true, err);
    }
    else if(res==null)
    {
        let addDto = new address(addDoc);
        addDto.save((err, userAddress) => {
            if (err) {
                callback(true, err);
            }
            else {
                callback(false, userAddress);
            }
        });
    }
    else 
    {
        callback(false, res);
    }
})

    
};

//------------------- get bill address --------------
exports.getBillAddress = function (userId, callback) {
    billaddress.find({ "userId": userId }, (err, userBillAddress) => {
        if (err) {
            callback(true, err);
        }
        else {
            callback(false, userBillAddress);
        }
    });
};

//------------------- get guest bill address --------------
exports.getGuestBillAddress = function (guestId, callback) {
    billaddress.find({ email: guestId }, (err, userBillAddress) => {
        if (err) {
            callback(true, err);
        }
        else {
            callback(false, userBillAddress);
        }
    });
};


//------------------- save bill address --------------
exports.saveBillAddress = function (addDoc, callback) {
    
    billaddress.findOne({"email": addDoc.email},(err,res)=>{
    if(err)
    {
        callback(true, err);
    }
    else if(res==null)
    {
    let addDto = new billaddress(addDoc);
    addDto.save((err, userBillAddress) => {
        if (err) {
            callback(true, err);
        }
        else {
            callback(false, userBillAddress);
        }
    });
}
else 
{
    callback(false, res); 
}
});
}

//------------------------------------Cancel Order ---------------------------

exports.cancelOrder = (orderId, productVal, callback) => {
    try {
        if (orderId) {
            orderSchema.findOne({ '_id': orderId }, (err, result) => {
                if (err){
                    callback(true, err);
                }
                else {
                    result.products.forEach((value, index) => {
                        orderSchema.updateOne({'_id': orderId ,"products.attrid": value.attrid  },{ $set:{"products.$.isCanceled":true,"products.$.status":'cancelled',"products.$.canceledDate":Date.now}}, (err, finalUpdatedresult ) => {
                            if (err){
                                callback(true, err);
                            }
                            
                        });
                       
                    });
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


//------------------------------------Cancel Order Item--------------------

exports.cancelOrderItem = (orderId, itemId,productVal, callback) => {
    try {
        if (orderId && itemId) {
                orderSchema.updateOne({'_id': orderId ,"products.attrid": itemId  },{ $set:{"products.$.isCanceled":true,"products.$.status":'cancelled',"products.$.canceledDate":Date.now}}, (err, result) => {
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

//---------------------------------------- Return Order-----------------------------------------
exports.returnOrder = (orderId, productVal, callback) => {
    try {
if (orderId) {
    var returnedDateTime =  dateFormat(now, "isoDateTime");
    orderSchema.findOne({ '_id': orderId }, (err, result) => {
        if (err){
            callback(true, err);
        }
        else {
            result.products.forEach((value, index) => {
                orderSchema.updateOne({'_id': orderId ,"products.attrid": value.attrid  },{ $set:{"products.$.isReturned":true,"products.$.status":'returned',"products.$.returnedDate":returnedDateTime}}, (err, finalUpdatedresult) => {
                    if (err){
                        callback(true, err);
                    }
                    
                });
            });
            
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




//------------------------------------Return Order Item--------------------

exports.returnOrderItem = (orderId,itemId, productVal, callback) => {
    try {
        if (orderId && itemId) {
            var returnedDateTime =  dateFormat(now, "isoDateTime");
            orderSchema.updateOne({'_id': orderId ,"products.attrid": itemId  },{ $set:{"products.$.isReturned":true,"products.$.status":'returned',"products.$.returnedDate":returnedDateTime}}, (err, result) => {
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

//-----------------------Order item preview which is in cart----------------------------------------
exports.ordersItemPreview = (userId, callback) => {
    try {    
        var expectedDeliveryDate =   addDays(4);
                if (userId) {
                    cartSchema.aggregate([
                        {
                        $match:{ "userId": userId , "isDeleted": false}},
                        {$unwind:"$product"},
                        {$project:{pid: {
                                $toObjectId: "$product.productId"
                              },
                              Quantity: "$product.quantity",
                              attrid: "$product.attrid",
                              productId: "$product.productId",
                            }
                        },                  
                      
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
                           name:"$productDetils.productName",
                           image:"$productDetils.productAttribute.image", 
                           color:"$productDetils.productAttribute.Color",
                           size:"$productDetils.productAttribute.Size",
                           price:"$productDetils.productAttribute.price",
                           attrid:"$productDetils.productAttribute.attrid",
                           offers :"",
                           expectedDeliveryDate:expectedDeliveryDate,
                           quantity:"$Quantity",
                           attrid1:"$attrid",
                           productId : "$productId"
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

//-----------------------Order item preview guest which is in cart----------------------------------------
exports.ordersItemPreviewGuest = (email, callback) => {
    try {    
        var expectedDeliveryDate =   addDays(4);
                if (email) {
                    cartSchema.aggregate([
                        {
                        $match:{ "email": email , "isDeleted": false}},
                        {$unwind:"$product"},
                        {$project:{pid: {
                                $toObjectId: "$product.productId"
                              },
                              Quantity: "$product.quantity",
                              attrid: "$product.attrid",
                              productId: "$product.productId",
                            }
                        },                  
                      
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
                           name:"$productDetils.productName",
                           image:"$productDetils.productAttribute.image", 
                           color:"$productDetils.productAttribute.Color",
                           size:"$productDetils.productAttribute.Size",
                           price:"$productDetils.productAttribute.price",
                           attrid:"$productDetils.productAttribute.attrid",
                           offers :"",
                           expectedDeliveryDate:expectedDeliveryDate,
                           quantity:"$Quantity",
                           attrid1:"$attrid",
                           productId : "$productId"
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


//-----------------------Ordered item List----------------------------------------
exports.ordersItemDetails = (userId, callback) => {
    try {       
        if (userId) {
            cartSchema.aggregate([
                {
                $match:{ "userId": userId }},
                {$unwind:"$products"},
                {$project:{pid: {
                        $toObjectId: "$products._id"
                      }
                    }
                },                  
              
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
                   name:"$productDetils.productName",
                   image:"$productDetils.productAttribute.image", 
                   color:"$productDetils.productAttribute.Color",
                   size:"$productDetils.productAttribute.Size",
                   price:"$productDetils.productAttribute.price",
                   offers :"",
                   expectedDeliveryDate:expectedDeliveryDate,
                   quantity:"$Quantity",
                   status:"",
                   oderedDate:""
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
     }
    catch (err) {
        //logger.error(err);
        return;
    }
}


exports.ordersDetails = (userId, callback) => {
    try {       
        if (userId) {
            orderSchema.aggregate([
                {
                $match:{ "userId": userId }},                
                {$unwind:"$products"},  
                {$sort : {"created_at":-1}},                   
                {$project:{pid: {
                        $toObjectId: "$products.productId",
                      },
                      Quantity: "$products.quantity",
                      attrid: "$products.attrid",
                      orderNo:"$orderNo",
                      netTotal : "$netTotal",
                      tax : "$tax",
                      subTotal : "$subTotal",
                      orderDate : "$created_at",
                      ordstatus : "$status",
                      status : "$products.status",
                      orderId:"$_id",
                      shippingCharge : "$shipping.charge"
                    }
                },                  
              
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
                    name:"$productDetils.productName",
                    image:"$productDetils.productAttribute.image", 
                    color:"$productDetils.productAttribute.Color",
                    size:"$productDetils.productAttribute.Size",
                    price:"$productDetils.productAttribute.price",
                    offers :"",
                    expectedDeliveryDate:"",
                    quantity:"$Quantity",
                    status:"",
                    oderedDate:"$orderDate",
                    attrid:"$productDetils.productAttribute.attrid",
                    attrid1 : "$attrid",
                    orderNo :"$orderNo",
                    netTotal : "$netTotal",
                    subTotal : "$subTotal",
                    tax : "$tax",
                    orderDate : "$orderDate",
                    status : "$status",
                    ordstatus : "$ordstatus",
                    orderId:"$orderId",
                    shippingCharge : "$shippingCharge"
        }

     }
                ], 
                (err, result) => {
                if (err) {
                    callback(true, err);
                }
                else {
                   
                    var orders=[];
                    var order=[];
                    var orderid=0;
                   
                    //var orderNum=0;
                    result.forEach(function(item){
                        if(orderid==0)
                        {
                            orderid=item.orderNo;
                            orderNum=item.orderNo;                            

                            orders.push({orderNum:orderNum,orderDate : item.orderDate, status: item.ordstatus, tax : item.tax, subTotal: item.subTotal,netTotal: item.netTotal,orderId:item.orderId,shippingCharge : item.shippingCharge, order: order});

                        }
                        if(orderid==item.orderNo)
                        {
                            orderNum=item.orderNo;
                            
                            
                            if (item.attrid == item.attrid1){                                   
                            order.push({
                            
                                attrid:item.attrid,
                                name:item.name,
                                image:item.image,
                                size: item.size,
                                color : item.color,
                                price: item.price,
                                offers: "",
                                expectedDeliveryDate: item.orderDate,
                                quantity: item.quantity,
                                status: item.status,
                                productId:item.productId
                            
                            });
                        }
                            
                           // orders.push(orderNumber);

                            // if (item.attrid == item.attrid1){                                   
                            //     resultCol.push(item);
                            //     }                             
                            
                            } 
                            else 
                            {
                                                               
                                orderid=item.orderNo;
                                orderNum=item.orderNo;
                                order = [];

                                orders.push({orderNum:orderNum,orderDate : item.orderDate, status:item.ordstatus, tax : item.tax, subTotal: item.subTotal,netTotal: item.netTotal,orderId:item.orderId,shippingCharge : item.shippingCharge, order: order});

                                order.push({
                            
                                    attrid:item.attrid,
                                    name:item.name,
                                    image:item.image,
                                    size: item.size,
                                    color : item.color,
                                    price: item.price,
                                    offers: "",
                                    expectedDeliveryDate: item.orderDate,
                                    quantity: item.quantity,
                                    status: item.status,
                                    productId:item.productId
                                
                                });
    
                            }});
                            
                    callback(false, orders);
                }
                
            })
        }
     }
    catch (err) {
        //logger.error(err);
        return;
    }
}

exports.getOrdersListByOrderNo = (orderNo, callback) => {
    try { 
            
        if (orderNo) {
            orderSchema.aggregate([
                {
                $match:{ "orderNo": orderNo }},                
                {$unwind:"$products"},  
                {$sort : {"created_at":-1}},                   
                {$project:{pid: {
                        $toObjectId: "$products.productId",
                      },
                      Quantity: "$products.quantity",
                      attrid: "$products.attrid",
                      orderNo:"$orderNo",
                      netTotal : "$netTotal",
                      tax : "$tax",
                      subTotal : "$subTotal",
                      orderDate : "$created_at",
                      ordstatus : "$status",
                      status : "$products.status",
                      orderId:"$_id",
                      shippingCharge : "$shipping.charge"
                    }
                },                  
              
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
                    name:"$productDetils.productName",
                    image:"$productDetils.productAttribute.image", 
                    color:"$productDetils.productAttribute.Color",
                    size:"$productDetils.productAttribute.Size",
                    price:"$productDetils.productAttribute.price",
                    offers :"",
                    expectedDeliveryDate:"",
                    quantity:"$Quantity",
                    status:"",
                    oderedDate:"$orderDate",
                    attrid:"$productDetils.productAttribute.attrid",
                    attrid1 : "$attrid",
                    orderNo :"$orderNo",
                    netTotal : "$netTotal",
                    subTotal : "$subTotal",
                    tax : "$tax",
                    orderDate : "$orderDate",
                    status : "$status",
                    ordstatus : "$ordstatus",
                    orderId:"$orderId",
                    shippingCharge : "$shippingCharge"
        }

     }
                ], 
                (err, result) => {
                if (err) {
                    callback(true, err);
                }
                else {
                   
                    var orders=[];
                    var order=[];
                    var orderid=0;
                   
                    //var orderNum=0;
                    result.forEach(function(item){
                        if(orderid==0)
                        {
                            orderid=item.orderNo;
                            orderNum=item.orderNo;                            

                            orders.push({orderNum:orderNum,orderDate : item.orderDate, status: item.ordstatus, tax : item.tax, subTotal: item.subTotal,netTotal: item.netTotal,orderId:item.orderId,shippingCharge : item.shippingCharge, order: order});

                        }
                        if(orderid==item.orderNo)
                        {
                            orderNum=item.orderNo;
                            
                            
                            if (item.attrid == item.attrid1){                                   
                            order.push({
                            
                                attrid:item.attrid,
                                name:item.name,
                                image:item.image,
                                size: item.size,
                                color : item.color,
                                price: item.price,
                                offers: "",
                                expectedDeliveryDate: item.orderDate,
                                quantity: item.quantity,
                                status: item.status,
                                productId:item.productId
                            
                            });
                        }
                            
                           // orders.push(orderNumber);

                            // if (item.attrid == item.attrid1){                                   
                            //     resultCol.push(item);
                            //     }                             
                            
                            } 
                            else 
                            {
                                                               
                                orderid=item.orderNo;
                                orderNum=item.orderNo;
                                order = [];

                                orders.push({orderNum:orderNum,orderDate : item.orderDate, status:item.ordstatus, tax : item.tax, subTotal: item.subTotal,netTotal: item.netTotal,orderId:item.orderId,shippingCharge : item.shippingCharge, order: order});

                                order.push({
                            
                                    attrid:item.attrid,
                                    name:item.name,
                                    image:item.image,
                                    size: item.size,
                                    color : item.color,
                                    price: item.price,
                                    offers: "",
                                    expectedDeliveryDate: item.orderDate,
                                    quantity: item.quantity,
                                    status: item.status,
                                    productId:item.productId
                                
                                });
    
                            }});
                            
                    callback(false, orders);
                }
                
            })
        }
     }
    catch (err) {
        //logger.error(err);
        return;
    }
}

//========================List of all Orders=============================
exports.getOrdersList = (req, callback) => {
    try {
        
        orderSchema.find({}, (err, result) => {
                if (err)
                    callback(true, err);
                else
                    callback(false, result);
            }).sort({_id:-1});

    }
    catch (err) {
        //logger.error(err);
        return;
    }
}


//------------------------------------Return Order Item--------------------

exports.updateOrderStatus = (productId,attrid,orderDetails, callback) => {
    var orderStatus = orderDetails.orderStatus;
    var updatedDate = orderDetails.updatedDate;
    var comment = orderDetails.comment;
    try {
        if (productId && attrid) {
            if(orderStatus == 'packed'){
            orderSchema.update({"products._id": productId ,"products.attrid": attrid  },{ $set:{"products.$.isPacked":true,"products.$.status":'packed',"products.$.packedDate":updatedDate,"products.$.comment":comment}}, (err, result) => {
            if (err){
                callback(true, err);
            }
            else {
                callback(false, result);
            }
        });
    }
    else if(orderStatus == 'shipped'){
        orderSchema.updateOne({"products._id": productId ,"products.attrid": attrid},{ $set:{"products.$.isShipped":true,"products.$.status":'shipped',"products.$.shippingDate":updatedDate,"products.$.comment":comment}}, (err, result) => {
        if (err){
            callback(true, err);
        }
        else {
            callback(false, result);
        }
    });
}
    else if(orderStatus == 'delivered'){
    orderSchema.updateOne({"products._id": productId ,"products.attrid": attrid },{ $set:{"products.$.isDelivereded":true,"products.$.status":'delivered',"products.$.deliveredDate":updatedDate,"products.$.comment":comment}}, (err, result) => {
    if (err){
        callback(true, err);
    }
    else {
        callback(false, result);
    }
});
}
    else if(orderStatus == 'picked'){
    orderSchema.updateOne({"products._id": productId ,"products.attrid": attrid },{ $set:{"products.$.isPicked":true,"products.$.status":'picked',"products.$.pickingDate":updatedDate,"products.$.comment":comment}}, (err, result) => {
    if (err){
        callback(true, err);
    }
    else {
        callback(false, result);
    }
});
}
else if(orderStatus == 'refunded'){
    orderSchema.updateOne({"products._id": productId ,"products.attrid": attrid },{ $set:{"products.$.isRefunded":true,"products.$.status":'refunded',"products.$.refundedDate":updatedDate,"products.$.comment":comment}}, (err, result) => {
    if (err){
        callback(true, err);
    }
    else {
        callback(false, result);
    }
});
}
else if(orderStatus == 'cancelled'){
    orderSchema.update({"_id": productId ,"products.attrid": attrid },{ $set:{"products.$.isCancelled":true,"products.$.status":'cancelled',"products.$.cancelledDate":updatedDate,"products.$.comment":comment}}, (err, result) => {
    if (err){
        callback(true, err);
    }
    else {
        callback(false, result);
    }
});
}
    } else {
        callback(true, {});
    }  
     
    }
    catch (err) {
        return;
    }
}
