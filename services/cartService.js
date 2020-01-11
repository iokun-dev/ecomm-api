let cartModel = require('../models/cartModel');
let authConfig = require('../config/auth');

exports.saveCartProducts = function (req, res) {
    try {
        let token = req.headers.token;
        if (token) {
            authConfig.verifyAppToken(token, (err, isAuth) => {
                if (err) {
                    res.status(400).json({ success: "false", message: "Error, Unauthorised User !" });
                }
                else {
                    let cartDoc = req.body;
                    cartModel.saveCartProducts(cartDoc, (err, savedCart) => {
                        if (err) {
                            if (savedCart === 1) {
                                res.status(400).json({ success: "false", message: "you can not add twice, same product in your cart !" });
                            }
                            else {
                                res.status(400).json({ success: "false", message: "error in cart saving !" });
                            }
                        }
                        else {
                            res.status(200).json({ success: "true", message: "Cart saved successfully", data: savedCart });
                        }
                    });
                }
            });
        }
        else {
            res.status(400).json({ success: "false", message: "error in cart saving !" });
        }
    }
    catch (err) {
        console.log(err);
        return;
    }
};



//guest save cart
exports.saveCartProductsGuest = function (req, res) {
    try {
        let cartDoc = req.body;
        cartModel.saveCartProducts(cartDoc, (err, savedCart) => {
            if (err) {
                if (savedCart === 1) {
                    res.status(400).json({ success: "false", message: "you can not add twice, same product in your cart !" });
                }
                else {
                    res.status(400).json({ success: "false", message: "error in cart saving !" });
                }
            }
            else {
                res.status(200).json({ success: "true", message: "Cart saved successfully", data: savedCart });
            }
        });


    }
    catch (err) {
        console.log(err);
        return;
    }
};

exports.addCartProductsIncrement = function (req, res) {
    try {
        let token = req.headers.token;
        if (token) {
            authConfig.verifyAppToken(token, (err, isAuth) => {
                if (err) {
                    res.status(400).json({ success: "false", message: "Error, Unauthorised User !" });
                }
                else {
                    let cartDoc = req.body;
                    cartModel.addCartProductsIncrement(cartDoc, (err, savedCart) => {
                        if (err) {
                            res.status(400).json({ success: "false", message: "error in cart saving !" });
                        }
                        else {
                            res.status(200).json({ success: "true", message: "Cart saved successfully", data: savedCart });
                        }
                    });
                }
            });
        }
        else {
            res.status(400).json({ success: "false", message: "error in cart saving !" });
        }
    }
    catch (err) {
        console.log(err);
        return;
    }
};

exports.getCartProducts = function (req, res) {
    try {
        let userId = req.query.userId;
        // let token = req.headers.token;
        // authConfig.verifyAppToken(token, (err, decoded) => {
        //     if (err) {
        //         res.status(400).json({ success: false, message: "Error, Unauthorised User !" });
        //     }
        //     else {
        cartModel.getCartProducts(userId, (err, orders) => {
            if (err) {
                res.status(400).json({ success: false, message: "error in getting cart !" });
            }
            else {
                res.status(200).json({ success: true, message: "carts", data: orders });
            }
        });
        //     }
        // });
    }
    catch (err) {
        console.log(err);
        return;
    }
};


exports.getCartProductsGuest = function (req, res) {
    try {
        let email = req.query.email;
        // let token = req.headers.token;
        // authConfig.verifyAppToken(token, (err, decoded) => {
        //     if (err) {
        //         res.status(400).json({ success: false, message: "Error, Unauthorised User !" });
        //     }
        //     else {
        cartModel.getCartProductsGuest(email, (err, orders) => {
            if (err) {
                res.status(400).json({ success: false, message: "error in getting cart !" });
            }
            else {
                res.status(200).json({ success: true, message: "carts", data: orders });
            }
        });
        //     }
        // });
    }
    catch (err) {
        console.log(err);
        return;
    }
};

//=================================Delete Cart ===============================================
exports.deleteCart = function (req, res) {
    try {
        let userId = req.query.userId;
        cartModel.deleteCart(userId, (err, cartData) => {
            if (err) {
                res.status(400).json({ success: false, message: "error in deleting cart !" });
            }
            else {
                res.status(200).json({ success: true, message: "carts", data: cartData });
            }
        });

    }
    catch (err) {
        console.log(err);
        return;
    }
};