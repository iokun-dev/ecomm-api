let authService = require('../config/auth');
//let logger = require('../config/winston')
let userModel = require('../models/userModel');

module.exports = (apiRoutes) => {
    //create token and login url
    apiRoutes.post('/api/login', (req, res) => {
        let userLogin = req.body;
        authService.creatAppToken(userLogin, (err, token) => {
            if (err)
                res.status(401).json({ success: false, message: "unauthorize User !" });
            else {
                res.status(200).json({ success: true, message: "login successfully.", data: token.data, success: true });
            }
        });
    });

     //verify token url
     apiRoutes.get('/api/verifyToken', (req, res) => {
        let token = req.query.token;
        authService.verifyAppToken(token, (err, decode) => {
            if (err) {
                logger.error(decode);
                res.status(401).json({ message: "unauthorize User !" });

            }
            else {
                res.status(200).json({ message: "token verified.", name: decode.email });
            }
        })
    });
};