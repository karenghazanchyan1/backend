const Class = require('../models/class');

function getClasses() {
    return Class.find();
}

function findClass(username) {
    return Class.findOne({ username });
}

function addClass(obj) {
    let newClass = new Class(obj);
    return newClass.save();
}

function updateClass(id, obj) {
    return Class.updateOne({ _id: id }, { $set: obj });
}

function deleteClass(id) {
    return Class.deleteOne({ _id: id });
}

module.exports = { getClasses, findClass, addClass, updateClass, deleteClass }