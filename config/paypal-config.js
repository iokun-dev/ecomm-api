const paypal = require('paypal-rest-sdk');
paypal.configure({
    'mode':'sandbox',
    'client_id':'enter client id',
    'client_secret':'enter client secret'
});
