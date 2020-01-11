/************
*  db.js file
*************/

// module.exports = {
//    // 'secret': 'restapisecret',
//     'database': 'mongodb://127.0.0.1:27017/ecomm'
//   };

  let mongoose = require('../node_modules/mongoose');
  mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb://localhost:27017/ecomm',{ useNewUrlParser: true } );
let conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', () => {
    console.log('Mongoose connected by ecomm');
});

mongoose.set('debug', true);
module.exports = conn;
