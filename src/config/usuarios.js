const mongoose = require('mongoose');
const usersCollection = "sessions";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, max: 100},
    password: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
});

const usersModel = mongoose.model(usersCollection, userSchema);

module.exports = { usersModel }