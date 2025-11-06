const express = require('express');
const authrouter = express.Router();
const {register, login} = require('../controllers/authController')

// register and login router
authrouter.post('/register', register);
authrouter.post('/login', login);

module.exports = {authrouter}

