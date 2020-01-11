let express = require('express');
var port = process.env.port || 8080;
let app = express();
let cors = require('cors');
let logger = require('./config/winston');
let bodyParser = require('body-parser');
var server = require('http').createServer(app);
const paypal = require('paypal-rest-sdk');
//app.set('view engine', 'ejs');
//for create log


// for parsing application/json
app.use(bodyParser.json({ limit: '50mb' }));

// for parsing application/xwww-
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(cors());
app.use('/files',express.static('uploads'));
let apiRoutes = express.Router();
require('./routes/login')(app);
require('./routes/admin')(app);
require('./routes/client')(app);

apiRoutes.use((req, res, next) => {
    console.log('router is runing');
    next();
});

//to check latest version of push
let packg = require('./package.json');
let version = packg.version;
app.get('/', (req, res) => {
    res.json('New System API for e-comm' + " " + version);
});

//port running/listen
server.listen(port, () => {
    console.log('Express server ' + process.pid + ' listening on port ' + port);

});

process.on('uncaughtException', (err, next) => {
    console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
    console.error(err.stack);
    logger.error(err);
    process.exit(500);
});

app.use((error, req, res, next) => {
    console.error(error);
    logger.error(error);
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});