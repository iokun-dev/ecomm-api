let mongoose = require('../node_modules/mongoose');
let Schema = mongoose.Schema;


let faqSchema = new Schema
    ({
        faq: [],
        isDeleted : {type: Boolean, default: false},
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now }
    }, { collection: 'faq' });

let faq = mongoose.model('faq', faqSchema);

module.exports = faq;
