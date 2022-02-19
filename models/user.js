const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    name: {
        type: String,
        require: [true, 'Name is required']
    },
    surname: {
        type: String,
        require: [true, 'Surname is required']
    },
    username: {
        type: String,
        require: [true, 'Username is required']
    },
    password: {
        type: String,
        require: [true, 'Password is required']
    },
    problem: {
        type: String,
        require: [true, 'Problem is required']
    },
    email: {
        type: String,
        require: [true, 'Email is required']
    },
    classes: {
        type: String,
        require: false
    }
});

module.exports = mongoose.model('User', User);