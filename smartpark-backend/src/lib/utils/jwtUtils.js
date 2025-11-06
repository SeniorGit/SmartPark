const jwt = require('jsonwebtoken');
const { token } = require('morgan');
require('dotenv').config();

const generateToken = (playload) =>{
    return jwt.sign(playload, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
}

const verfyJwtToken = (token) =>{
     return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {generateToken, verfyJwtToken}