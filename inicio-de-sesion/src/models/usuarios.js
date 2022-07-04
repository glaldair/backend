const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/globals.js');

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}, () => console.log('Connected'));

const usersCollection = "usuarios";
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, max: 100},
    password: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
});

module.exports = mongoose.model(usersCollection, userSchema);