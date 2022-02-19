const User = require('../models/user');

function getUsers() {
    return User.find();
}

function findUser(username) {
    return User.findOne({ username });
}

function addUser(obj) {
    let newUser = new User(obj);
    return newUser.save();
}

function updateUser(username, obj) {
    return User.updateOne({ username }, { $set: obj });
}

function deleteUser(username) {
    return User.deleteOne({ username });
}

module.exports = { getUsers, findUser, addUser, updateUser, deleteUser }