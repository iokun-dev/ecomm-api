let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let orderSchema = new Schema
    ({
        userId: String,
        orderNo: String,
        fullName: String,
        email: String,
        contectNo: String,
        billingAdd: String,
        pinCode: Number,
        status: String,
        checkoutMetod: { type: Object, default: {} },
        shippingInfo: { type: Object, default: {} },
        shipping: { type: Object, default: {} },   //To store shipping Method and Shipping Charges    
        paymentMathod: { type: Object, default: {} },
        paymentTranDetails:[],
        products: [{
            "name": String,
            "quantity": Number,
            "productId": String,
            "price": {type:Number,default:0},
            "attrid":String,            
            "isPacked":{type: Boolean, default: false},
            "packedDate":String,
            "isShipped":{type: Boolean, default: false},
            "shippingDate":String,
            "isDelivereded":{type: Boolean, default: false},
            "deliveredDate":String,            
            "isCancelled":{type: Boolean, default: false},
            "cancelledDate":String,
            "isReturned":{type: Boolean, default: false},
            "returnedDate":String,            
            "isPicked":{type: Boolean, default: false},
            "pickingDate":String,          
            "isRefunded":{type: Boolean, default: false},
            "refundedDate":String,
            "comment":String,
            "status":String
        }],
        isPaid: { type: Boolean, default: false },
        netTotal: Number,
        subTotal:Number,
        tax:Number,
        paid: Number,
        comment: String,
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now }
    }, { collection: 'orders' });

let orders = mongoose.model('orders', orderSchema);

module.exports = orders;
