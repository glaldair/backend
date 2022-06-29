const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/auth', {
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