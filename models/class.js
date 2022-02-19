const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Class = new Schema({
    code: {
        type: String,
        require: [true, 'Code is required']
    },
    name: {
        type: String,
        require: [true, 'Name is required']
    },
    image: {
        type: String,
        require: [true, 'Image is required']
    },
    description: {
        type: String,
        require: [true, 'Description is required']
    },
    html: {
        type: String,
        require: [true, 'Body is required']
    }
});

module.exports = mongoose.model('Class', Class);