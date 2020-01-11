let orderModel = require('../models/orderModel')
let config = require('./../config/auth');
let emailConfig = require('./../config/emailConfig');


exports.sendOrderMail=(req,res)=>{
var subject= req.body.subject;
var content= req.body.content;
var email= req.body.email;
emailConfig.sendOrderMailToUser(email, subject, content, function (error, sent) {
        // console.log("mailOptions===>",mailOptions);
            if (error) {
                res.status(400).json({success:false,message:error})
            } else {
                console.log(sent);
                res.status(200).json({success:true,message:"Email sent on your email",sent})
            }
        })
}
// var Session = require('express-session');

// var Session = Session({
// 	secret:'iokunapp',
// 	saveUninitialized: true,
// 	resave: true
// });

var sessionInfo;

//save user order
exports.saveOrder = function (req, res) {
    try {
        let token = req.headers.token;
        let order = req.body;
        let paypalres = {paypalData:'',clientData:''};
        config.verifyAppToken(token, (err, decoded) => {
            if (err) {
                res.status(400).json({ success: false, message: "Error, Unauthorised User !" });
            }
            else {
                if(order.paymentMathod && order.paymentMathod.cardType && order.paymentMathod.cardType=='PayPal' && order.isPaid==0)
                {
                    orderModel.payNow(order,function(error,result){
                        if(error){
                            res.writeHead(200, {'Content-Type': 'text/plain'});
                            res.end(JSON.stringify(error));
                        }else{

                            paypalres.paypalData = result;
                            paypalres.clientData = req.body;
                            //res.redirect(result.redirectUrl);
                            res.status(200).json({ success: true, message: "order placed successfully.", data: result.redirectUrl });
                            
                        }		
                    });
            }
        
            else 
            {
                orderModel.saveOrder(order, (err, orders) => {
                    if (err) {
                        res.status(400).json({ success: false, message: "error in saving order !" });
                    }
                    else {
                        res.status(200).json({ success: true, message: "order placed successfully.", data: orders });
                        //res.redirect(orders);
                    }
                });
            }
            }
        });
    }
    catch (err) {
        console.log(err);
        return;
    }
};

//save guest order
exports.saveGuestOrder = function (req, res) {
    try {
        let order = req.body;
        let paypalres = {paypalData:'',clientData:''};
                if(order.paymentMathod && order.paymentMathod.cardType && order.paymentMathod.cardType=='PayPal' && order.isPaid==0)
                {
                    orderModel.payNow(order,function(error,result){
                        if(error){
                            res.writeHead(200, {'Content-Type': 'text/plain'});
                            res.end(JSON.stringify(error));
                        }else{
                            paypalres.paypalData = result;
                            paypalres.clientData = req.body;
                            //res.redirect(result.redirectUrl);
                            res.status(200).json({ success: true, message: "order placed successfully.", data: result.redirectUrl });
                        }		
                    });
            }
        
            else 
            {
                orderModel.saveOrder(order, (err, orders) => {
                    if (err) {
                        res.status(400).json({ success: false, message: "error in saving order !" });
                    }
                    else {
                        res.status(200).json({ success: true, message: "order placed successfully.", data: orders });
                        //res.redirect(orders);
                    }
                });
            }
            }
    catch (err) {
        console.log(err);
        return;
    }
};

exports.paynow = function(req,res){
    const data ={
        userID : sessionInfo.sessionData.userID,
        data : req.body
    }
    /*
    * call to paynow helper method to call paypal sdk
    */
    helper.payNow(data,function(error,result){
        if(error){
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(JSON.stringify(error));
        }else{
            sessionInfo.paypalData = result;
            sessionInfo.clientData = req.body;
            res.redirect(result.redirectUrl);
        }				
    });			
}

exports.getOrders = function (req, res) {
    try {
        let userId = req.query.userId;
        let token = req.headers.token;
        config.verifyAppToken(token, (err, decoded) => {
            if (err) {
                res.status(400).json({ success: false, message: "Error, Unauthorised User !" });
            }
            else {
                orderModel.getOrders(userId, (err, orders) => {
                    if (err) {
                        res.status(400).json({ success: false, message: "error in getting order !" });
                    }
                    else {
                        res.status(200).json({ success: true, message: "orders", data: orders });
                    }
                });
            }
        });
    }
    catch (err) {
        console.log(err);
        return;
    }
};

exports.dispatchOrder = function (req, res) {
    try {
        let token = req.headers.token;
        let status = req.body.status;
        let orderNo = req.body.orderNo;
        config.verifyAppToken(token, (err, decoded) => {
            if (err) {
                res.status(400).json({ success: false, message: "Error, Unauthorised User !" });
            }
            else {
                orderModel.dispatchOrder(status, orderNo, (err, orders) => {
                    if (err) {
                        res.status(400).json({ success: false, message: "error in saving order !" });
                    }
                    else {
                        res.status(200).json({ success: true, message: "order placed successfully.", data: orders });
                    }
                });
            }
        });
    }
    catch (err) {
        console.log(err);
        return;
    }
};

//get exist ship address
exports.getExistAddress = function (req, res) {
    try {
        let userId = req.body.userId;
        let token = req.headers.token;
        let guestId = req.body.guestId;
        if(req.body.isGuest) {
            orderModel.guestShipAddress(guestId, (err, address) => {
                if (err) {
                    res.status(400).json({ success: false, message: "error in getting exist address !" });
                }
                else {
                    res.status(200).json({ success: true, message: "exist address", data: address });
                }
            });
        } else {
            config.verifyAppToken(token, (err, decoded) => {
                if (err) {
                    res.status(400).json({ success: false, message: "Error, Unauthorised User !" });
                }
                else if(!decoded){
                    res.status(404).json({ success: false, message: "Invalid token" });
                }

                else {
                    orderModel.getExistAddress(userId, (err, address1) => {
                        if (err) {
                            res.status(400).json({ success: false, message: "error in getting exist address !" });
                        }
                        else if(!address1){
                            res.status(404).json({ success: false, message: "No data found" });
                        }
                        else {
                            res.status(200).json({ success: true, message: "exist address", data: address1 });
                        }
                    });
                }
            });
        }
    }
    catch (err) {
        console.log(err);
        return;
    }
};

//save ship address
exports.saveAddress = function (req, res) {
    try {
        let token = req.headers.token;
        let addDoc = req.body;
        if(req.body.isGuest) {
            orderModel.saveAddress(addDoc, (err, address) => {
                if (err) {
                    res.status(400).json({ success: false, message: "error in getting exist address !" });
                }
                else {
                    res.status(200).json({ success: true, message: "exist address", data: address });
                }
            });
        }
        else {
            config.verifyAppToken(token, (err, decoded) => {
                if (err) {
                    res.status(400).json({ success: false, message: "Error, Unauthorised User !" });
                }
                else {
                    orderModel.saveAddress(addDoc, (err, address) => {
                        if (err) {
                            res.status(400).json({ success: false, message: "error in getting exist address !" });
                        }
                        else {
                            res.status(200).json({ success: true, message: "exist address", data: address });
                        }
                    });
                }
            });
        }
    }
    catch (err) {
        console.log(err);
        return;
    }
};

//----------------- get bill address -------------------
exports.getBillAddress = function (req, res) {
    try {
        let userId = req.body.userId;
        let token = req.headers.token;
        let guestId = req.body.guestId;
        if(req.body.isGuest) {
            orderModel.getGuestBillAddress(guestId, (err, address) => {
                if (err) {
                    res.status(400).json({ success: false, message: "error in getting bill address !" });
                }
                else {
                    res.status(200).json({ success: true, message: "exist address", data: address });
                }
            });
        } else {
            config.verifyAppToken(token, (err, decoded) => {
                if (err) {
                    res.status(400).json({ success: false, message: "Error, Unauthorised User !" });
                }
                else {
                    orderModel.getBillAddress(userId, (err, address) => {
                        if (err) {
                            res.status(400).json({ success: false, message: "error in getting bill address !" });
                        }
                        else {
                            res.status(200).json({ success: true, message: "exist address", data: address });
                        }
                    });
                }
            });
        }  
    }
    catch (err) {
        console.log(err);
        return;
    }
};

//------------------------------Save Bill Address ---------------------------
exports.saveBillAddress = function (req, res) {
    try {
        let token = req.headers.token;
        let addDoc = req.body;
        if(req.body.isGuest) {
            orderModel.saveBillAddress(addDoc, (err, billaddress) => {
                if (err) {
                    res.status(400).json({ success: false, message: "error in getting exist address !" });
                }
                else {
                    res.status(200).json({ success: true, message: "exist address", data: billaddress });
                }
            });
        }

        else {
            config.verifyAppToken(token, (err, decoded) => {
                if (err) {
                    res.status(400).json({ success: false, message: "Error, Unauthorised User !" });
                }
                else {
                    orderModel.saveBillAddress(addDoc, (err, billaddress) => {
                        if (err) {
                            res.status(400).json({ success: false, message: "error in getting exist address !" });
                        }
                        else {
                            res.status(200).json({ success: true, message: "exist address", data: billaddress });
                        }
                    });
                }
            });
        }

    }
    catch (err) {
        console.log(err);
        return;
    }
};

//------------------------------------Cancel Order --------------------

exports.cancelOrder = (req, res) => {
    let orderId = req.query.orderId;
    let productVal = req.body;
    orderModel.cancelOrder(orderId, productVal, (err, orderListResult) => {
        if (err) {
            res.status(400).json({ success: false, message: "Error, In updating order information !" })
        }
        else {
            res.status(200).json({ success: true, message: "order update successfully", data: orderListResult});
        }
    });
};

//------------------------------------Cancel Order Item--------------------

exports.cancelOrderItem = (req, res) => {
    let orderId = req.query.orderId;
    let itemId = req.query.itemId;
    let productVal = req.body;
    orderModel.cancelOrderItem(orderId, itemId,productVal, (err, orderListResult) => {
        if (err) {
            res.status(400).json({ success: false, message: "Error, In updating order information !" })
        }
        else {
            res.status(200).json({ success: true, message: "order update successfully", data: orderListResult});
        }
    });
};

//------------------------------------Return Order--------------------

exports.returnOrder = (req, res) => {
    let orderId = req.query.orderId;
    let productVal = req.body;
    orderModel.returnOrder(orderId, productVal, (err, orderListResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In updating order information !" })
        }
        else {
            res.status(200).json({ success: true, message: "order update successfully", data: orderListResult});
        }
    });
};



//------------------------------------Return Order Item--------------------

exports.returnOrderItem = (req, res) => {
    let orderId = req.query.orderId;
    let itemId = req.query.itemId;
    let productVal = req.body;
    orderModel.returnOrderItem(orderId,itemId, productVal, (err, orderListResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In updating order information !" })
        }
        else {
            res.status(200).json({ success: true, message: "order update successfully", data: orderListResult});
        }
    });
};

//------------------------------------Order item preview--------------------------------

exports.ordersItemPreview = (req, res) => {
    let userId = req.query.userId;
    orderModel.ordersItemPreview(userId, (err, orderListResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In getting information !" })
        }
        else {
            res.status(200).json({ success: true, message: "List get successfully", data: orderListResult});
        }
    });
};


//------------------------------------guest Order item preview--------------------------------

exports.OrdersItemPreviewGuest = (req, res) => {
    let email = req.query.email;
    orderModel.ordersItemPreviewGuest(email, (err, orderListResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In getting information !" })
        }
        else {
            res.status(200).json({ success: true, message: "List get successfully", data: orderListResult});
        }
    });
};

//------------------------------------Order item Details--------------------------------

exports.ordersItemDetails = (req, res) => {
    let userId = req.query.userId;
    orderModel.ordersItemDetails(userId, (err, orderListResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In getting information !" })
        }
        else {
            res.status(200).json({ success: true, message: "List get successfully", data: orderListResult});
        }
    });
};


exports.ordersDetails = (req, res) => {
    let userId = req.query.userId;
    orderModel.ordersDetails(userId, (err, orderListResult) => {        
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In getting information !" })
        }
        else {
            orderListResult.sort
            res.status(200).json({ success: true, message: "List get successfully", data: orderListResult});
        }
    });
};
//========================List of all Orders=============================
exports.getOrdersList = (req, res) => {
    orderModel.getOrdersList(req, (err, orderListResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In getting information !" })
        }
        else {
            res.status(200).json({ success: true, message: "List get successfully", data: orderListResult});
        }
    });
};

exports.getOrdersListByOrderNo = (req, res) => {
    let orderNo = req.query.orderNo;
    orderModel.getOrdersListByOrderNo(orderNo, (err, orderListResult) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In getting information !" })
        }
        else {
            res.status(200).json({ success: true, message: "List get successfully", data: orderListResult});
        }
    });
};

//=======================================Update Order Status==========================================
exports.updateOrderStatus = (req, res) => {
    let productId = req.query.productId;
    let attrid  = req.query.attrid;
    let orderDetails = req.body;
    
    orderModel.updateOrderStatus(productId,attrid,orderDetails, (err, orderStatus) => {
        if (err) {
            logger.error(err);
            res.status(400).json({ success: false, message: "Error, In updating information !" })
        }
        else {
            res.status(200).json({ success: true, message: "List updated successfully", data: orderStatus});
        }
    });
};


//=======================================Send Mail==========================================
exports.sendMail = (req, res) => {

    let userEmail  = req.body.userEmail;
    let orderDetails = req.body.orderDetails;
    
            emailConfig.sendMailToUser(userEmail);
            res.status(200).json({ success: true, message: "Email send successfully"});
       
    
};

//=======================================Send OrderRelated Mail(s)==========================================
// exports.sendOrderMail = (req, res) => {

//     let userEmail  = req.body.userEmail;
//     let orderDetails = req.body.orderDetails;
//     let subject = req.body.subject;
//     let content = req.body.content;
//     let type = req.body.type;
//     emailConfig.sendOrderMailToUser(userEmail, subject, content,type);
//     res.status(200).json({ success: true, message: "Email send successfully"});
// };
