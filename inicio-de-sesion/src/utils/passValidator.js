const bcrypt = require('bcrypt');

function passValidator(user, password) {
    return bcrypt.compareSync(password, user.password)
}

module.exports = {passValidator}