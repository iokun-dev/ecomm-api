let mongoose = require('../node_modules/mongoose');
let Schema = mongoose.Schema;
let imageSliderSchema = new Schema
({
    title: String, 
    subTitle: String, 
    description: String, 
    sliderImage : String, 
    sliderLink : String,
    isDeleted : {type: Boolean, default: false},
    isActive: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
},
    { collection: 'imageSlider' }
);
let imageSlider = mongoose.model('imageSlider', imageSliderSchema);

module.exports = imageSlider;