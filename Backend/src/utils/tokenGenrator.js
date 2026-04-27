
const jwt = require('jsonwebtoken');

const tokenGenrator = (userId) => {

    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = { tokenGenrator }


