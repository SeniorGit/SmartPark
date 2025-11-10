const express = require('express');
const authrouter = express.Router();
const {register, login} = require('../controllers/authController')
const {registerValidator, loginValidator} = require('../lib/validator/authValidator')
// register and login router
authrouter.post('/register', registerValidator, register);
authrouter.post('/login',loginValidator, login);

module.exports = {authrouter}

