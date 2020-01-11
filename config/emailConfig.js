var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var request = require('request');
exports.sendMailToUser = function (inputJson, res) {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: "put user",
            pass: "put pass"
        }
    });
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'put from', // sender address
        //to: 'ioakaarjun@gmail.com', // list of receivers
        to: inputJson, // list of receivers
        subject: 'Thanks for choosing us', // Subject line
        //text: 'Hello world ?', // plaintext body
        html: '<div class="col-sm-12 mt pd">'

        +'<div class="container-fluid">'
    
           +'<div class="newsletter2">'
    
                +'<div class="box_shadow mt-2">'
    
                    
                    +'<div class="" style="background-color:#3498DB;">'
                        +'<div class="main_content px-5">'
                            +'<h3 class="text-justify text-white">Success !</h3>'
                        +'</div>'
                    +'</div>'
                    +'<div class="px-4 py-4">'
                    +'<div class="row">'
                        +'<div class="col-sm-12">'
                        +'<div class="col-sm-7 pl-0">'
                            +'<img src="image url" class="img-fluid" style="height: 100px">'
    
                        +'</div>'
                        +'<div class="col-sm-5 text-right pr-0 mt-3">'
                            +'<!--<p class="mb">mobile num</p>-->'
                            +'<div class="navbar-nav pull-right">'
                                +'<ul class="list-inline">'
                                    +'<li><a href="">1</a></li>'
                                    +'<li><a href="">2</a></li>'
                                    +'<li><a href="">3</a></li>'
    
                                +'</ul>'
                            +'</div>'
    
                        +'</div>'
                    +'</div>'
                   +'</div>'
                    +'</div>'
                    +'<hr>'
                    +'<div class="">'
                    +'<div class="row">'
                        +'<div class="col-sm-12">'
                            +'<div class="text-right main_content px-5">'
                               + '<h3 class="mt-0">Mail Confirmation</h3>'
                               + '<p>Mail ID : FL96601289</p>'
                           + '</div>'
                        +'</div>'
                   + '</div>'
                   + '</div>'
                    +'<div class="px-4">'
                       + '<div class="left_align main_content">'
                            +'<h3> <span class="pink">Hello User..</span></h3>'
                           + '<p class="left_align grey mt-4" style="color: #333333">Thank you for your mail. We will send a confirmation when your'
                        +'</div>'
                    +'</div>'
                    +'<div class="part">'
                    +'</div>'
    
                    + '<div class="footer_section" style="background: #f6f6f6;padding: 1rem;">'
                       +'<div class="row px-4">'
                            +'<div class="col-sm-12">'
                        +'<div class="col-sm-6">'
                            +'<div class="regards">'
                                +'<h5 class="mt-4 " style="">Arriving,</h5>'
                                +'<h5 style="font-weight: bold;" class="mt-0">Monday, May 13</h5>'
                            +'</div>'
                        +'</div>'
                        +'<div class="col-sm-6">'
                            +'<div class="regards">'
                                +'<h5 class="mt-4 " style="">Hello:</h5>'
                                +'<h5 style="font-weight: bold;" class="mt-0">IO</h5>'
                                +'<p>Yo</p>'
                            +'</div>'
                        +'</div>'
                                +'<div class="col-sm-6">'
                                    +'<div class="regards">'
                                        +'<h5 class="mt-4 " style="">Your mail speed:</h5>'
                                        +'<h5 style="font-weight: bold;" class="mt-0">Prime</h5>'
                                        +'<button type="button" class="btn btn-success">View mail</button>'
                                    +'</div>'
                                +'</div>'
                    +'</div>'
                        +'</div>'
                    +'</div>'
                    +'<div class="left main_content  py-5 px-5">'
                        +'<h4 style="" class="pink">mail Details</h4><hr>'
                        +'<div class="">'
                            +'<div class="px-5 py-5">'
                                +'<div class="blog-post">'
                                    +'<h4 class="blog-post-title">mail FL96601289</h4>'
                                    +'<p class="blog-post-meta mt-4">sent on Sunday , May 12, 2019</p>'
    
                                    +'<div class="information-blocks">'
                                        +'<div class="table-responsive">'
                                            +'<table class="cart-table">'
                                                +'<tbody>'
                                                
                                                +'<tr>'
                                                    +'<td>'
    +'<img src="img path" class="img-responsive width">'
                                                    +'</td>'
                                                    +'<td colspan="2">'
                                                        +'<div class="traditional-cart-entry">'
                                                            +'<a href="#" class="image"><img src="" alt=""></a>'
                                                            +'<div class="content">'
                                                                +'<div class="cell-view">'
                                                                    +'<a class="tag ng-binding"></a>'
                                                                    +'<a class="title ng-binding">some text <br>Asome text</a>'
                                                                    +'<div class="inline-description"></div>'
                                                                    +'<div class="inline-description"></div>'
                                                                +'</div>'
                                                            +'</div>'
                                                        +'</div>'
                                                    +'</td>'
                                                    +'<td class="">Hey</td>'
    
                                                +'</tr>'
                                                +'<tr style="padding: 1rem !important;">'
                                                        +'<td colspan="2">'
    
                                                    +'</td>'
                                                    +'<td>  <label class="pull-right">End</label></td>'
                                                    +'<td> <div class="totals">'
                                                        +'<div class="totals-item ">'
                                                            +'<div class="totals-value">100%</div>'
                                                        +'</div>'
                                                    +'</div>'
                                                    +'</td>'
                                                +'</tr>'
                                                    +'<tr>'
                                                    +'<td colspan="2"></td>'
                                                    +'<td><label class="pull-right">Done now</label></td>'
                                                    +'<td> <div class="totals">'
                                                        +'<div class="totals-item ">'
                                                            +'<div class="totals-value">100%</div>'
                                                        +'</div>'
                                                    +'</div>'
                                                    +'</td>'
                                                +'</tr>'
                                                +'</tbody>'
                                            +'</table>'
                                        +'</div>'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        +'</div>'
                    +'</div>'
    
                +'</div>'
    
            +'</div>'
        +'</div>'
    
    +'</div>'
    +'<div class="clearfix"></div>'
    
    
    
    
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            //res.status(200).json({ success: false, message: "Message not sent"});
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};

exports.sendOrderMailToUser = function (email, subject, content, res) {
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "user name",
            pass: "pass"
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    // setup e-mail data with unicode symbols
    var newHtml = 'Send Mail'
   
    var mailOptions = {
        from: 'enter from', // sender address
        //to: 'ioakaarjun@gmail.com', // list of receivers
        to: email, // list of receivers
        subject: content, // Subject line
        //text: 'Hello world ?', // plaintext body
        html: '<div class="col-sm-12 mt pd">'
        +'<div class="container-fluid">'
           +'<div class="newsletter2">'
                +'<div class="box_shadow mt-2">'   
                    +'<div class="" style="background-color:#3498DB;">'
                      
                    +'</div>'
                    +'<div class="px-4 py-4">'
                    +'<div class="row">'
                        +'<div class="col-sm-12">'
                                          
                    +'</div>'
                   +'</div>'
                    +'</div>'  
                    +'<div class="px-4">'
                       + '<div class="left_align main_content">'                          
                           + '<p class="left_align grey mt-4" style="color: #333333">'+subject+'</p>'
                        +'</div>'
                    +'</div>' 
                +'</div>'    
            +'</div>'
        +'</div>'    
    +'</div>'
    +'<div class="clearfix"></div>'
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            //res.status(200).json({ success: false, message: "Message not sent"});
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};
